/* ==========================================================
   Base 5 - the parent portal (/parents/)
   Everything here is general: nothing about any one child.
   The timetable and this week come from /data/term.js, so the
   portal always matches what students see.

   SAFEGUARDING CONTACTS: fill these in exactly as the school
   publishes them (names and routes only, nothing personal).
   Until they are filled in, the portal shows only the routes
   that are always true: 999, the school office and Jay, and
   the NSPCC helpline. Nothing is made up.

   Edit it from the staff room: /teacher/parents.html builds a new
   copy of this file to upload.

   Plain ASCII only. Use ' for apostrophes. Text goes into the
   page as plain text, so no HTML is needed (or works) here.
   ========================================================== */
window.B5PARENTS = {

  /* A short notice at the top of the portal, e.g. a change to the week.
     Leave text "" for none. until: "YYYY-MM-DD", the last day it shows (or ""). */
  notice: { text: "Base 5 returns on Tuesday 3 November. Monday 2 November is an INSET day.", until: "2026-11-03" },

  /* Who parents get in touch with about Base 5 */
  contact: { name: "Jay", email: "jay.raine@chiltonbridgeschool.co.uk" },

  /* Sections that can be switched off. "Worried about something?" is always shown. */
  show: { thisweek: true, cultural: true, timetable: true, rhythms: true, lunch: true, how: true, safe: true, contact: true, look: true },

  /* Lunch: the school menu as a PDF (upload it to the parents folder on GitHub as
     lunch-menu.pdf, or link one the school publishes). Leave "" for none. */
  lunchPdf: "/parents/lunch-menu.pdf",
  lunchPdfLabel: "The school lunch menu (PDF)",

  /* How lunch works for Base 5. [title, text] */
  lunch: [
    ["Ordered by staff", "Staff order each student's lunch from the school kitchen in advance, so there is nothing to arrange from home."],
    ["Trip days", "The kitchen provides packed lunches, eaten while the group is out."],
    ["Allergies and diets", "Chilton Bridge is a nut free school. We keep a record of each student's allergies and dietary needs, so please let Jay or the school office know of any changes."]
  ],

  safeguarding: {
    /* [name, role], e.g. ["A Name", "Designated Safeguarding Lead"] */
    team: [["Helen", "Designated Safeguarding Lead"]],
    office: "",     /* the school office phone number, as published */
    email: "",      /* a safeguarding email address, if the school publishes one */
    policy: "",     /* link to the safeguarding policy on the school website */
    checked: "October 2026"     /* the date these were last checked, e.g. "October 2026" */
  },

  /* The shape of every day, in order. [title, when, what it is like] */
  day: [
    ["Breathe in", "9:30", "A quiet arrival, with time to settle before anything is asked."],
    ["Brain games", "9:45", "Fifteen minutes of puzzles and quick games to start the day. Nothing is marked."],
    ["Cultural calendar", "10:00", "Half an hour on the day or festival the school is marking that week."],
    ["PHSE with Willow", "10:30, three days", "Fifteen minutes on Mondays, Thursdays and Fridays, based on discussion rather than writing."],
    ["Morning sessions", "10:30 to lunch", "Maths and English in short sections, with each student working at their own level. Most days also include forest school, digital media or horticulture."],
    ["Lunch", "Around midday", "On trip days, lunch is eaten while out."],
    ["The afternoon", "12:30 to 2:00", "Project work on the half term's question, or GCSE work for students taking exams. Depending on the day, there is also a creative session, physical world, PE or preparation for adulthood."],
    ["Breathe out", "2:00", "A calm end to the day before home time at 2:30."]
  ],

  /* What each day of the week is like. */
  week: {
    mon: "Forest school with Vernon in the morning, then project work and a creative session.",
    tue: "Trip day. The group is out of school for most of the day. Trip details are sent to families directly and are not published online.",
    wed: "Digital media with Andy, then project work, and physical world in the afternoon.",
    thu: "Horticulture with Kara in the morning, then an extended project or GCSE session.",
    fri: "The longest maths and English session of the week, followed by PE and preparation for adulthood."
  },

  /* Small things that can help, from home. */
  helps: [
    ["Outdoor clothes", "Forest school and horticulture run in most weathers, so a coat on Mondays and Thursdays is rarely a mistake. Tuesdays are trip days."],
    ["Knowing the plan", "Each day follows the same structure. The home page and day pages show what is on now and next."],
    ["Homework", "There is no set homework. The website works at home if your child would like to show you anything."],
    ["Difficult mornings", "If a morning has been hard, letting Jay or the office know helps us plan the day."]
  ],

  /* How the site keeps students safe. Each line is how it actually works. */
  safety: [
    ["No names, photos or work in public", "Students appear on the website by initials only. No photos of students are published and no student work is publicly visible."],
    ["Private pages", "Each student's own area opens only with their school account, a staff account or a personal four digit code."],
    ["Trips", "Trip locations and times are never published online. Details come to families directly from school."],
    ["No messaging between students", "Students cannot message each other. Anything a student sends goes only to Jay, and anything other students can see, such as the question wall, is checked by Jay first and never shows a name."],
    ["Data held by the school", "Progress is stored in the school's own Google account, not by an outside company. Staff pages open only for approved staff accounts."],
    ["Guest mode", "When looking around as a guest, nothing is saved or sent and no student work is shown."]
  ]
};
