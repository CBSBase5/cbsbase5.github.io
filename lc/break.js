/* ==========================================================
   LC's Night Shift HQ - jumpscares are earned
   Puts the Jumpscare and Hide one for later buttons behind the
   same earning, break and cooldown as the other HQ games
   (numbers in /data/hqbreak.js): a go opens a few minutes when
   both buttons work as many times as LC likes.
   Home page only, after /lc/jumpscare.js and /data/hqbreak.js.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak) return;
window.LCGate = window.HQBreak.wrap({
  prefix: "b5.lc.",
  title: "Jumpscares",
  icon: "",
  theme: { card: "#fbf8e4", cardInk: "#0e0f0b", accent: "#c9f7d8", accent2: "#e0475b", font: 'var(--display,"Space Mono",monospace)' },
  words: {
    earnedTitle: "Jumpscares are earned",
    earn: "Anything counts, even Show me.",
    coolingTitle: "All quiet on the night shift",
    cooling: "The monsters are recharging. Have a crack at something else in the meantime.",
    coolingShort: "All quiet.",
    done: "Lights back on."
  },
  launcher: false
});
})();
