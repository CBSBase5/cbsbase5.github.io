/* ==========================================================
   LW's Skills HQ - Monster Movie is earned
   Puts Monster Movie behind the same earning, break and cooldown
   as the other HQ games (numbers in /data/hqbreak.js).
   Home page only, after /lw/monster.js and /data/hqbreak.js.
   The take in progress always gets to finish: monster.js holds
   the "That is the break" card back until the review is up.
   ASCII only in this file.
   ========================================================== */
(function(){
"use strict";
if(!window.HQBreak || !window.LWMonster) return;
window.LWGate = window.HQBreak.wrap({
  prefix: "b5.lw.",
  title: "Monster Movie",
  icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="15" width="30" height="20" rx="2" fill="#2a1030"/><rect x="8" y="19" width="24" height="3" fill="#fff8ee"/><rect x="8" y="25" width="16" height="3" fill="#fff8ee" opacity=".7"/><g transform="rotate(-16 5 15)"><rect x="5" y="8" width="30" height="7" rx="1.5" fill="#fff8ee" stroke="#2a1030" stroke-width="1.5"/><path d="M10 8l4 7M18 8l4 7M26 8l4 7" stroke="#2a1030" stroke-width="3"/></g><circle cx="31" cy="30" r="5" fill="#ffc53d" stroke="#2a1030" stroke-width="1.5"/><circle cx="29.5" cy="29" r="1.6" fill="#2a1030"/></svg>',
  theme: { card: "#fff8ec", cardInk: "#2a0f14", accent: "#ffc247", accent2: "#e0475b", font: 'var(--display,Arial,sans-serif)' },
  words: {
    earn: "Anything counts, even Show me.",
    coolingTitle: "Between takes",
    cooling: "The crew are on a tea break. Have a crack at something else in the meantime.",
    coolingShort: "Tea break.",
    done: "That's a wrap."
  },
  open: function(){ window.LWMonster.open(); },
  close: function(){ window.LWMonster.close(); },
  openSel: ".lwmm"
});
})();
