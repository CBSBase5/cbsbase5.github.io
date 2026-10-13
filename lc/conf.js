/* LC's Night Shift HQ: tells the shared HQ scripts (in /egw/) whose space this is.
   Loaded first on every page in /lc/, before skin.js and engine.js.
   readAloud adds a "Read it to me" button to every question and explainer. */
window.HQ = {
  who: "LC",
  prefix: "b5.lc.",
  base: "/lc/",
  hq: "Night Shift HQ",
  readAloud: true,
  look: { name: "Night shift", line: "The original. Empty corridors and buzzing lights." }
};
