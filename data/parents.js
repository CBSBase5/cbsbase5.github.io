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
  notice: { text: "", until: "" },

  /* Who parents get in touch with about Base 5 */
  contact: { name: "Jay", email: "jay.raine@chiltonbridgeschool.co.uk" },

  /* Sections that can be switched off. "Worried about something?" is always shown. */
  show: { thisweek: true, timetable: true, rhythms: true, how: true, safe: true, contact: true, look: true },

  safeguarding: {
    /* [name, role], e.g. ["A Name", "Designated Safeguarding Lead"] */
    team: [],
    office: "",     /* the school office phone number, as published */
    email: "",      /* a safeguarding email address, if the school publishes one */
    policy: "",     /* link to the safeguarding policy on the school website */
    checked: ""     /* the date these were last checked, e.g. "October 2026" */
  },

  /* The shape of every day, in order. [title, when, what it is like] */
  day: [
    ["Breathe in", "9:30", "A calm arrival. Nobody is asked anything straight away: time to come in, settle and land."],
    ["Brain games", "9:45", "Fifteen minutes of puzzles and quick games to warm up. Nothing is marked or written up."],
    ["Cultural calendar", "10:00", "Half an hour on whatever the calendar is marking that week, and why people mark it at all."],
    ["The main sessions", "Late morning", "Maths and English in short chunks, each student in their own space on the site, pitched at where they are. Plus the day's practical session: forest school, digital media, horticulture or PE."],
    ["Lunch", "Around midday", "A proper break. On trip days, lunch happens while the group is out."],
    ["Project time", "Afternoon", "Each student's own project on the half term's big question, or GCSE work for those taking exams."],
    ["Breathe out", "2:00", "Winding down before home time at 2:30. Students can say what was alright about the day, or say nothing at all."]
  ],

  /* What each day of the week is like. */
  week: {
    mon: "Forest school with Vernon before lunch, outside whatever the weather is doing. Then project time and something creative to finish the day.",
    tue: "Trip day. The group is out of school for most of the day, with lunch while out. Details of each trip come to you directly from school, never on this website.",
    wed: "Digital media with Andy, hands on with the kit. Then project time, and exploring the physical world after lunch.",
    thu: "Horticulture with Kara, outside in the beds. Then a long slot for projects or GCSE work.",
    fri: "The longest maths and English slot of the week, then PE, and preparation for adulthood to close the week."
  },

  /* Small things that can help, from home. Gentle, never rules. */
  helps: [
    ["Outdoor clothes", "Mondays and Thursdays are partly outside, and Tuesdays are trip days. A coat helps on all three."],
    ["Knowing the shape", "Every day starts and ends the same way. If your child likes to know what is coming, the home page and the day pages show what is on now and next."],
    ["Nothing to chase", "There is no homework to chase. If your child wants to show you something, the site works at home too, and anything they try counts."],
    ["Any day can change", "If something is hard on a given morning, telling Jay or the office helps us make the day work."]
  ],

  /* How the site keeps students safe. Each line is how it actually works. */
  safety: [
    ["No names, photos or work in public", "Students appear on this website only by their initials. No photos of students are shown, and nobody's work is visible to the public."],
    ["Their own pages are private", "Each student's own space opens only on their school account, a staff account, or a four digit code of their own."],
    ["Trips stay off the internet", "Where trips go, and when, is never published here. Trip details come to you directly from school."],
    ["No chatting between students", "Students cannot message each other on the site. Anything a student sends goes only to Jay. Anything other students could see, like the question wall or the ideas board, is checked by Jay first and never shows a name."],
    ["Saved by the school", "Progress is saved in the school's own Google account, not by an outside company. Staff pages open only for approved school staff accounts."],
    ["Guest mode keeps nothing", "If you look around as a guest, nothing you do is saved or sent, and no student's work is shown."]
  ]
};
