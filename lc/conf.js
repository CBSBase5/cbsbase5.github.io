/* LC's Night Shift HQ: tells the shared HQ scripts (in /egw/) whose space this is.
   Loaded first on every page in /lc/, before skin.js and engine.js.
   readAloud adds a "Read it to me" button to every question and explainer.
   easyRead (30 Oct 2026): LC has significant dyslexia, so his HQ and
   activities use very little text (see EASY in /egw/engine.js). */
window.HQ = {
  who: "LC",
  prefix: "b5.lc.",
  base: "/lc/",
  hq: "Night Shift HQ",
  readAloud: true,
  easyRead: true,
  look: { name: "Night shift", line: "The original. Empty corridors and buzzing lights." }
};
