/* ==========================================================
   JT's Training Ground - the Penalty Shootout is earned
   Puts the shootout behind the same earning, break and cooldown
   as the other HQ games (numbers in /data/hqbreak.js).
   Home page only, after /jt-hq/penalty.js and /data/hqbreak.js.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak || !window.JTPenalty) return;
window.JTGate = window.HQBreak.wrap({
  prefix: "b5.jthq.",
  title: "Penalty Shootout",
  icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="#fff" stroke="#10231a" stroke-width="2"/><path d="M20 12l6 4-2 7h-8l-2-7z" fill="#10231a"/><path d="M20 12V6M26 16l6-2M24 23l4 6M16 23l-4 6M14 16l-6-2" stroke="#10231a" stroke-width="1.6"/></svg>',
  theme: { card: "#ffffff", cardInk: "#10231a", accent: "#ffc72c", accent2: "#2fbf71", font: 'Oswald,"Arial Narrow",Arial,sans-serif' },
  words: {
    earn: "Anything counts, even Show me.",
    coolingTitle: "Half time",
    cooling: "The team is in the dressing room. Have a crack at something else in the meantime.",
    coolingShort: "Half time.",
    done: "Final whistle."
  },
  open: function(){ window.JTPenalty.open(); },
  close: function(){ window.JTPenalty.close(); },
  openSel: ".jtpen"
});
})();
