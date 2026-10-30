/* ==========================================================
   Base 5 - the parent portal (/parents/)
   Everything here is general: nothing about any one child.
   The timetable and this week come from /data/term.js, so the
   portal always matches what students see.

   SAFEGUARDING CONTACTS: fill these in exactly as the school
   publishes them (names and routes only, nothing personal).
   Until they are filled in, the portal shows only the routes
   that are always true: the school office, Jay and Holly.
   Nothing is made up.

   Edit it from the staff room: /teacher/parents.html builds a new
   copy of this file to upload.

   Plain ASCII only. Use ' for apostrophes. Text goes into the
   page as plain text, so no HTML is needed (or works) here.
   ========================================================== */
window.B5PARENTS = {

  /* A short notice at the top of the portal, e.g. a change to the week.
     Leave text "" for none. until: "YYYY-MM-DD", the last day it shows (or ""). */
  notice: { text: "Monday 2 November is an INSET day, and we look forward to seeing everyone on Tuesday 3 November.", until: "2026-11-03" },

  /* Who parents and carers get in touch with about Base 5 */
  contact: { name: "Jay", email: "jay.raine@chiltonbridgeschool.co.uk" },

  /* Sections that can be switched off. "Worried about something?" is always shown. */
  show: { thisweek: true, cultural: true, timetable: true, rhythms: true, lunch: true, how: true, safe: true, contact: true, look: true },

  /* Lunch: the school menu as a PDF (upload it to the parents folder on GitHub as
     lunch-menu.pdf, or link one the school publishes). Leave "" for none. */
  lunchPdf: "/parents/lunch-menu.pdf",
  lunchPdfLabel: "The school lunch menu (PDF)",

  /* How lunch works for Base 5. [title, text] */
  lunch: [
    ["Ordered for them", "We order each student's lunch from the school kitchen ahead of time, so there is nothing to sort out from home."],
    ["Trip days", "The kitchen makes packed lunches."],
    ["Allergies and diets", "Chilton Bridge is a nut free school. We keep a note of each student's allergies and diet, so please let us or the office know if anything changes."]
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
    ["Breathe in", "9:30", "A calm arrival. We give everyone time to settle in before anything is asked."],
    ["Brain games", "9:45", "Fifteen minutes of games like GeoGuessr and Wordle to warm up. Nothing is marked."],
    ["Cultural calendar", "10:00", "Half an hour on whatever the school is marking that week, and why people mark it."],
    ["PHSE", "10:30, three days", "Fifteen minutes on Mondays, Thursdays and Fridays. Talking rather than writing. Willow, the school's PHSE lead, sometimes joins us."],
    ["Morning sessions", "10:30 to lunch", "Maths and English in short sections, which I pitch at each student's level. Most days also have forest school, digital media or horticulture."],
    ["Lunch", "11:45", "A proper break. On trip days, lunch happens while the group is out."],
    ["The afternoon", "12:30 to 2:00", "Projects on the half term's big question, or GCSE work for those taking exams. Depending on the day, there is also something creative, physical world, PE or preparation for adulthood."],
    ["Breathe out", "2:00", "Winding down together before home time at 2:30."]
  ],

  /* What each day of the week is like. */
  week: {
    mon: "Forest school with Vernon in the morning, then project time and something creative to finish.",
    tue: "Trip day. Details come to you directly from school.",
    wed: "Digital media with Andy, then project time, and the physical world after lunch.",
    thu: "Horticulture with Kara in the morning, then a long slot for projects or GCSE work.",
    fri: "The longest maths and English slot of the week, then PE, and preparation for adulthood to round off the week."
  },

  /* Small things that can help, from home. */
  helps: [
    ["Outdoor clothes", "Forest school and horticulture run in most weathers, on Mondays and Thursdays."],
    ["Knowing the plan", "Every day has the same shape. If your young person likes to know what is coming, the home page shows what is on now and next."],
    ["At home", "The website works at home too, if your young person would like to show you anything."],
    ["Tricky mornings", "If a morning has been hard, a quick word with us or the office helps us shape the day around it."]
  ],

  /* How the site keeps students safe. Each line is how it actually works. */
  safety: [
    ["No names, photos or work in public", "Students appear on the website by their initials only. No photos of students are shown, and no one's work is public."],
    ["Their own pages are private", "Each student's own space opens only on their school account, a staff account or their own four digit code."],
    ["Trips stay offline", "Where trips go, and when, is never published here. Details come to you directly from school."],
    ["No chatting between students", "Students cannot message each other. Anything a student sends comes only to me, and anything others can see, like the question wall, is checked by me first and never shows a name."],
    ["Kept by the school", "Progress is saved in the school's own Google account, not by an outside company. Staff pages open only for approved staff accounts."],
    ["Guest mode keeps nothing", "If you look around as a guest, nothing is saved or sent, and no student work is shown."]
  ]
};
