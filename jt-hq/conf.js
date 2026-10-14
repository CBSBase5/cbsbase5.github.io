/* JT's Training Ground: tells the shared HQ scripts (in /egw/) whose space this is.
   Loaded first on every page in /jt-hq/, before skin.js and engine.js.
   Storage uses b5.jthq. so it never touches JT's Dugout (b5.jt.).
   readAloud adds a "Read it to me" button to every question and explainer. */
window.HQ = {
  who: "JT",
  prefix: "b5.jthq.",
  base: "/jt-hq/",
  hq: "Training Ground",
  readAloud: true,
  look: { name: "Floodlights", line: "The original. A pitch at night under the lights." }
};
