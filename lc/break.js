/* ==========================================================
   LC's Night Shift HQ - the earned break
   Night Corridor (/lc/corridor.js) and the Jumpscare and Hide one
   for later buttons (/lc/jumpscare.js) all sit behind the same
   earning, break and cooldown as the other HQ games (numbers in
   /data/hqbreak.js): a go opens a few minutes when the corridor
   and both scare buttons work as many times as LC likes.
   Home page only, after /lc/corridor.js, /lc/jumpscare.js and
   /data/hqbreak.js. ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak) return;
var game = !!window.LCCorridor;
window.LCGate = window.HQBreak.wrap({
  prefix: "b5.lc.",
  title: game ? "Night Corridor" : "Jumpscares",
  icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="6" fill="#1b1c16"/><polygon points="2,2 38,2 25,15 15,15" fill="#d8d4b4"/><polygon points="2,38 38,38 25,26 15,26" fill="#5e5a4a"/><polygon points="2,2 15,15 15,26 2,38" fill="#b9a65a"/><polygon points="38,2 25,15 25,26 38,38" fill="#a8964c"/><rect x="15" y="15" width="10" height="11" fill="#9c8c4a"/><rect x="17" y="18" width="6" height="8" fill="#5b4a33"/><rect x="16.5" y="15.8" width="7" height="2" fill="#5dff9b"/><rect x="11" y="5" width="18" height="2.5" rx="1" fill="#fffbe0"/></svg>',
  theme: { card: "#fbf8e4", cardInk: "#0e0f0b", accent: "#e6d84a", accent2: "#39d98a", font: 'var(--display,"Space Mono",monospace)' },
  words: {
    earnedTitle: game ? "The night shift is earned" : "Jumpscares are earned",
    earn: "Anything counts, even Show me. A go opens the corridor and the jumpscares.",
    coolingTitle: "All quiet on the night shift",
    cooling: "The lights are recharging. Have a crack at something else in the meantime.",
    coolingShort: "All quiet.",
    done: "Lights back on."
  },
  open: game ? function(){ window.LCCorridor.open(); } : null,
  close: game ? function(){ window.LCCorridor.close(); } : null,
  openSel: game ? ".lccorr" : null,
  launcher: game
});
})();
