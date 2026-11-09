/* ==========================================================
   Base 5 - the project book's week by week plan (Autumn 2, 2026)
   Which steps of the project book (ELP workbook) are suggested for
   each week of the half term. Used by:
     /data/projectbook.js   "This week" on the map, a ring on those stops
     /day/index.html        the Project session shows this week's steps
   Change the steps here and both follow. Students can still do any
   step in any order: this is only a suggestion.
   Step ids are the ones in STEPS in /data/projectbook.js.
   ASCII only in this file.
   ========================================================== */
window.B5BOOKPLAN = {
  book: "a2-2026",
  bases: { EGW: "/egw/", LP: "/lp/", LW: "/lw/", LC: "/lc/", HK: "/hk/", JT: "/jt-hq/" },
  names: {
    intro: "Introduce the Project", brain: "Brainstorming", research: "Research, Read, Ask", criteria: "Criteria Creation",
    expert: "Consult the Expert", explore: "Explore and Fieldwork", document: "Document and Record", skill: "Skill Up",
    drafts: "Making Drafts", experiment: "Experiment", midway: "Midway Checkpoint", reflect: "Reflect and Feedback",
    safety: "Safety Session", make: "Make it! Build it!", extend: "Extend and Expand", review: "Final Review",
    celebrate: "Celebration: Exhibit and Admire", prespractice: "Presentation Practice", present: "Presentation",
    finalref: "Final Reflections", answer: "The Answer and the Outcomes"
  },
  weeks: [
    { n: 1, start: "2026-11-03", end: "2026-11-08", steps: ["intro", "brain"] },
    { n: 2, start: "2026-11-09", end: "2026-11-15", steps: ["research", "criteria"] },
    { n: 3, start: "2026-11-16", end: "2026-11-22", steps: ["expert", "explore", "document"] },
    { n: 4, start: "2026-11-23", end: "2026-11-29", steps: ["skill", "drafts", "experiment"] },
    { n: 5, start: "2026-11-30", end: "2026-12-06", steps: ["midway", "reflect", "safety", "make"] },
    { n: 6, start: "2026-12-07", end: "2026-12-13", steps: ["make", "extend", "review"] },
    { n: 7, start: "2026-12-14", end: "2026-12-18", steps: ["celebrate", "prespractice", "present", "finalref", "answer"] }
  ],
  /* the week a date falls in ("YYYY-MM-DD"), or null */
  weekOf: function(iso){
    var w = this.weeks.filter(function(x){ return iso >= x.start && iso <= x.end; })[0];
    return w || null;
  },
  today: function(){
    var d = new Date(), p = function(n){ return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }
};
