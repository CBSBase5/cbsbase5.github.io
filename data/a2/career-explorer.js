/* Base 5 Autumn 2 activity: Career explorer.
   Preparation for Adulthood. Reading a job profile on a careers
   website and pulling out three interesting facts about one career.
   ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
var INK = "#141a33";
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || INK) + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* ---------- pictures ---------- */
var SECT = [
  ["What you do", "#ffd23f", '<rect x="-14" y="-14" width="28" height="28" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/><path d="M-8 -4l5 6 11 -12" fill="none" stroke="' + INK + '" stroke-width="3"/>'],
  ["Pay", "#19c39a", '<circle r="15" fill="#ffd23f" stroke="' + INK + '" stroke-width="2.5"/>' + T(0, 6, "&#163;", 18, { b: 1, a: "middle" })],
  ["Hours", "#22b8e6", '<circle r="15" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/><path d="M0 -9v9l7 5" fill="none" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>'],
  ["How to get in", "#ff5d8f", '<path d="M-14 -2l14 -10 14 10z" fill="' + INK + '"/><rect x="-10" y="-2" width="20" height="14" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>'],
  ["Skills", "#8a5cf6", '<path d="M0 -16l5 10 11 2 -8 8 2 11 -10 -5 -10 5 2 -11 -8 -8 11 -2z" fill="#ffd23f" stroke="' + INK + '" stroke-width="2"/>']
];
/* a job profile web page, drawn */
var PAGE = '<svg viewBox="0 0 540 290" role="img" aria-label="A job profile page with sections: what you do, pay, hours, how to get in, skills">' +
  '<rect width="540" height="290" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="16" width="500" height="262" rx="10" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>' +
  '<path d="M20 26q0 -10 10 -10h480q10 0 10 10v18h-500z" fill="#d9d8e6"/><circle cx="36" cy="31" r="5" fill="#e04848"/><circle cx="52" cy="31" r="5" fill="#ffd23f"/><circle cx="68" cy="31" r="5" fill="#19c39a"/>' +
  '<rect x="90" y="23" width="300" height="16" rx="8" fill="#fff"/>' + T(100, 36, "Job profiles: search", 12, { c: "#5b6180" }) +
  T(40, 74, "Job profile: [[Job]]", 16, { b: 1 }) +
  SECT.map(function(c, k){
    var y = 96 + k * 34;
    return '<rect x="40" y="' + (y - 2) + '" width="460" height="28" rx="6" fill="' + c[1] + '" fill-opacity=".22"/>' +
      '<g transform="translate(58 ' + (y + 12) + ') scale(.7)">' + c[2] + '</g>' + T(80, y + 18, c[0], 15, { b: 1 });
  }).join("") +
  A2ART.egg(A2ART.bonnie(480, 64, 0.38, "sit"), "Bonnie's dream career: professional sock thief. Pay: biscuits. Hours: whenever Jay is not looking.") +
  '</svg>';

var ICONS5 = '<svg viewBox="0 0 540 150" role="img" aria-label="Five sections of a job profile">' +
  '<rect width="540" height="150" rx="16" fill="#f4f1ea"/>' +
  SECT.map(function(c, k){
    var x = 60 + k * 105;
    return '<circle cx="' + x + '" cy="62" r="38" fill="' + c[1] + '" fill-opacity=".35" stroke="' + INK + '" stroke-width="2.5"/>' +
      '<g transform="translate(' + x + ' 62) scale(1.3)">' + c[2] + '</g>' + T(x, 128, c[0], 13, { b: 1, a: "middle" });
  }).join("") + '</svg>';

/* the themed sample profile (html, so it reads like a real page) */
function profile(more){
  return '<div class="a2task"><h4>Job profile: [[Job]]</h4>' +
    '<p><b>What you do:</b> As a [[job]] you [[do1]]. You also [[do2]].</p>' +
    '<p><b>Where:</b> You work [[place]], [[when]].</p>' +
    '<p><b>Hours:</b> 40 hours a week, usually over 5 days.</p>' +
    '<p><b>Pay:</b> starting about &pound;21,600 a year. With experience, about &pound;32,000.</p>' +
    '<p><b>How to get in:</b> [[route]].</p>' +
    '<p><b>Skills:</b> [[skill]], and working well in a team.</p>' +
    (more ? '<p><b>Did you know?</b> [[Fact]]</p><p><b>Career path:</b> [[path]]</p>' : '') +
    '<p class="tiny">An example profile, made up for practice. Real figures are on real careers websites.</p></div>';
}

/* fact or not a fact: a magnifier */
var FACTS = '<svg viewBox="0 0 540 190" role="img" aria-label="Three notes about a job: one specific, one vague, one an opinion">' +
  '<rect width="540" height="190" rx="16" fill="#f4f1ea"/>' +
  [["Specific", "#19c39a", ["Works 40 hours", "a week"]], ["Vague", "#ffd23f", ["Does lots of", "stuff"]], ["Opinion", "#ff8a8a", ["It is the best", "job ever"]]].map(function(c, k){
    var x = 22 + k * 170;
    return '<rect x="' + x + '" y="24" width="156" height="120" rx="12" fill="#fff" stroke="' + c[1] + '" stroke-width="4"/>' +
      T(x + 78, 54, c[0], 16, { b: 1, a: "middle" }) + T(x + 78, 88, c[2][0], 14, { a: "middle" }) + T(x + 78, 108, c[2][1], 14, { a: "middle" }) +
      (k === 0 ? '<path d="M' + (x + 64) + ' 126l10 10 20 -22" fill="none" stroke="#1f9d63" stroke-width="5" stroke-linecap="round"/>' : '');
  }).join("") +
  T(270, 176, "The best facts are specific: a number, a place, a name.", 14, { a: "middle", c: "#5b6180" }) + '</svg>';

/* Jay at work */
var JAYJOB = '<svg viewBox="0 0 520 200" role="img" aria-label="Jay in front of a whiteboard with a bird drawn on it">' +
  '<rect width="520" height="200" rx="16" fill="#e8f7ff"/>' +
  '<rect x="40" y="24" width="250" height="140" rx="8" fill="#fff" stroke="#5b6180" stroke-width="5"/>' +
  T(60, 60, "Today:", 16, { b: 1 }) + T(60, 88, "Careers!", 20, { b: 1, c: "#e04848" }) +
  A2ART.egg(A2ART.bird(230, 120, 0.9, "#3a8fd6"), "Jay always draws a bird on the board. Nobody knows why. (He likes birds.)") +
  A2ART.jay(380, 96, 0.95, "smile") + '</svg>';

/* hunt steps */
var HUNT = '<svg viewBox="0 0 540 170" role="img" aria-label="Search, read, pick three facts, write them in your own words">' +
  '<rect width="540" height="170" rx="16" fill="#f4f1ea"/>' +
  [["Search", "a job", "#22b8e6"], ["Read", "the profile", "#ffd23f"], ["Pick", "3 facts", "#19c39a"], ["Own", "words", "#ff5d8f"]].map(function(c, k){
    var x = 70 + k * 133;
    return '<circle cx="' + x + '" cy="72" r="44" fill="' + c[2] + '" fill-opacity=".4" stroke="' + INK + '" stroke-width="2.5"/>' +
      T(x, 30 + 36, String(k + 1), 22, { b: 1, a: "middle" }) + T(x, 92, c[0], 14, { b: 1, a: "middle" }) +
      T(x, 138, c[1], 14, { a: "middle" }) + (k < 3 ? '<path d="M' + (x + 50) + ' 72h28" stroke="' + INK + '" stroke-width="3"/><path d="M' + (x + 76) + ' 66l8 6 -8 6z" fill="' + INK + '"/>' : '');
  }).join("") + '</svg>';

/* ---------- widget: the career hunt ---------- */
var STARTS = [["like", "A job I already like the sound of"], ["hobby", "Something linked to a hobby"], ["random", "A random job, just to see"]];
var HUNT_TICKS = ["Open a careers website (Jay can help find one)", "Search for a job, or browse a list", "Read the whole profile", "Note three facts that interest me", "Put them in my career fact file, if I like"];
function huntWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Career hunt</h4>' +
    '<p>For a careers website, away from this page. A good free one is the National Careers Service: search for <b>job profiles</b>. Your choices save here and can go to Jay.</p>' +
    '<p style="font-weight:700;margin:10px 0 6px">Where to start, if you like:</p><div class="ce-start" style="display:flex;gap:8px;flex-wrap:wrap"></div>' +
    '<p style="font-weight:700;margin:12px 0 6px">Tick off as you go:</p><div class="ce-list"></div></div>';
  var st = el.querySelector(".ce-start"), list = el.querySelector(".ce-list");
  function drawStart(){
    st.innerHTML = STARTS.map(function(s){
      var on = d.start === s[0];
      return '<button type="button" data-s="' + s[0] + '" aria-pressed="' + on + '" style="font:inherit;cursor:pointer;padding:8px 14px;border-radius:12px;border:3px solid ' + (on ? "#141a33" : "#d9d8e6") + ';background:' + (on ? "#ffd23f" : "#fff") + ';font-weight:' + (on ? 700 : 400) + '">' + s[1] + '</button>';
    }).join("");
  }
  st.addEventListener("click", function(e){
    var b = e.target && e.target.closest ? e.target.closest("button[data-s]") : null;
    if(!b) return;
    d.start = b.getAttribute("data-s");
    try{ api.save(); }catch(err){}
    drawStart();
    api.done("done");
  });
  HUNT_TICKS.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:center;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(err){} api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
  drawStart();
}

(window.A2PACKS = window.A2PACKS || {})["career-explorer"] = {
  a2: true,
  id: "a2-career-explorer",
  title: "Career explorer",
  subject: "Preparation for Adulthood",
  bodyClass: "subj-home subj-pillar",
  mins: 20,
  line: "How to read a job profile on a careers website, and pick out the facts worth keeping.",
  blurb: "Exploring careers with a careers website. Four short chunks: what a job profile is, reading one, picking out interesting facts, and a career hunt to try on a real website. You make a career fact file at the end.",
  note: "Exploring jobs on a careers website and picking out three facts worth knowing. Four five minute chunks and a career fact file to make, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Window shopper", line: "Window shopper: short profiles, finding what a job is and where it happens." },
    { id: "medium", name: "Job hunter", line: "Job hunter: pay, hours and routes in, and picking specific facts." },
    { id: "spicy", name: "Career detective", line: "Career detective: pay sums, career paths, own words, and trusting your sources." }
  ],
  themes: {
    time: { name: "Time travel", w: { job: "archaeologist", jobs: "archaeologists", do1: "dig up and record objects from the past", do2: "write reports about what you find",
      place: "on digs outdoors and in museums", when: "often outdoors in all weathers", route: "usually a university degree, and volunteering on digs helps",
      skill: "patience and an eye for detail", fact: "some archaeologists work underwater, exploring shipwrecks.", path: "site assistant, then supervisor, then project manager.", top: "project manager",
      own: "Some archaeologists explore shipwrecks under the sea." } },
    football: { name: "Football", w: { job: "groundskeeper", jobs: "groundskeepers", do1: "cut, water and mark out the pitch", do2: "repair the grass after matches",
      place: "at stadiums and training grounds", when: "with early mornings and weekends", route: "a college course or an apprenticeship",
      skill: "knowing about grass, soil and machines", fact: "some stadium pitches have heating under the grass so it never freezes.", path: "assistant groundskeeper, then head groundskeeper, then grounds manager.", top: "grounds manager",
      own: "Heating under some stadium pitches stops the grass freezing." } },
    horror: { name: "Horror", w: { job: "special effects make up artist", jobs: "special effects make up artists", do1: "create fake scars, monsters and ageing effects", do2: "test materials so they are safe on skin",
      place: "on film and TV sets and in theatres", when: "with long days and very early starts", route: "a college course in make up, then building a portfolio of your work",
      skill: "art and design skills", fact: "a full monster make up can take several hours to put on.", path: "trainee, then make up artist, then head of the make up team.", top: "head of the make up team",
      own: "It can take hours to put on a full monster make up." } },
    fishing: { name: "Fishing", w: { job: "fish farm technician", jobs: "fish farm technicians", do1: "feed the fish and check the water quality", do2: "check the fish for signs of illness",
      place: "at fish farms and hatcheries", when: "often outdoors in all weathers", route: "a college course or an apprenticeship",
      skill: "an interest in science and nature", fact: "some hatcheries raise baby fish to release into rivers.", path: "technician, then senior technician, then farm manager.", top: "farm manager",
      own: "Some baby fish are raised in hatcheries and then let go into rivers." } },
    music: { name: "Music", w: { job: "stage manager", jobs: "stage managers", do1: "run the show backstage and call the cues", do2: "keep the cast and crew on time",
      place: "in theatres and on tours", when: "with lots of evenings and weekends", route: "a college course, or working your way up backstage",
      skill: "being calm and organised", fact: "stage managers give the signal for every light and sound change in a show.", path: "assistant stage manager, then stage manager, then production manager.", top: "production manager",
      own: "The stage manager signals every light and sound change in a show." } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: PAGE,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "What is a job profile?", title: "A job profile is a page about one job",
      fig: PAGE,
      html: "<p>Careers websites have a <b>job profile</b> for hundreds of jobs. Each one is set out in the same <b>sections</b>, so you know where to look.</p>" +
        "<p><b>What you do</b>, <b>pay</b>, <b>hours</b>, <b>how to get in</b> and <b>skills</b>. Here is one for a [[job]].</p>",
      lv: { spicy: { html: "<p>Careers websites have a <b>job profile</b> for hundreds of jobs, all set out in the same <b>sections</b>: what you do, pay, hours, how to get in, and skills. Many also show a <b>career path</b>: the jobs you could move up to.</p>" +
        "<p>Because every profile uses the same sections, you can <b>compare</b> two jobs side by side. Here is one for a [[job]].</p>" } } },

    { type: "mc", topic: "What is a job profile?",
      q: "Which section would tell you how much a [[job]] earns?",
      fig: ICONS5,
      options: ["Pay", "Skills", "What you do"],
      answer: 0,
      slips: { 1: "Skills tells you what you need to be good at, not the money.", 2: "That says what the job involves day to day." },
      hint: "Look for the coin.",
      why: "Earnings are in the Pay section.",
      lv: { spicy: { q: "You want to know if you need a degree to be a [[job]]. Which section?",
          options: ["How to get in", "Pay", "Hours"],
          slips: { 1: "Pay is about money, not qualifications.", 2: "Hours is about when you work." },
          hint: "Which section is about getting the job in the first place?",
          why: "How to get in lists the routes: college, apprenticeship, university or straight in." } } },

    { type: "match", topic: "What is a job profile?",
      q: "Match each question to the section that answers it.",
      pairs: [["Would I work weekends?", "Hours"], ["What would I do all day?", "What you do"], ["Do I need to go to college?", "How to get in"], ["What do I need to be good at?", "Skills"]],
      hint: "Read each question and think: time, tasks, training or talents?",
      why: "Weekends are hours. Tasks are what you do. College is how to get in. Being good at things is skills.",
      lv: { medium: { pairs: [["Would I work weekends?", "Hours"], ["What would I do all day?", "What you do"], ["Do I need to go to college?", "How to get in"], ["What do I need to be good at?", "Skills"], ["How much would I earn?", "Pay"]] },
        spicy: { pairs: [["Would I work weekends?", "Hours"], ["What would I do all day?", "What you do"], ["Can I do an apprenticeship?", "How to get in"], ["Do I need to be organised?", "Skills"], ["How much could I earn later on?", "Pay"], ["What job could I move up to?", "Career path"]] } } },

    { type: "mc", topic: "What is a job profile?",
      q: "Jay's job is teacher. Which of these would you find on a teacher job profile?",
      fig: JAYJOB,
      options: ["You need a degree and teacher training", "Teachers are always right", "Jay's favourite bird"],
      answer: 0,
      slips: { 1: "That is an opinion (and Jay would like it to be true). Profiles stick to facts.", 2: "Lovely, but a profile is about the job, not one person." },
      hint: "Which one could be true of every teacher, and checked?",
      why: "How to get in is a real section, and it is a fact you could check." },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Read a profile", title: "Read a profile",
      html: "<p>Here is an example profile. Read it once, then have a go at the questions. You can come back up to it any time.</p>" + profile(false),
      lv: { spicy: { html: "<p>Here is an example profile. Read it once, then have a go at the questions. You can come back up to it any time.</p>" + profile(true) } } },

    { type: "mc", topic: "Read a profile",
      q: "Where does a [[job]] work?",
      options: ["[[Place]]", "In an office every day", "From home"],
      answer: 0,
      slips: { 1: "Have a look at the Where section again.", 2: "The profile does not say that. Look at the Where section." },
      hint: "Look at the Where section.",
      why: "The profile says: [[place]].",
      lv: { medium: { q: "What is one way into this job?",
          options: ["[[Route]]", "You have to be famous first", "There is no way in"],
          slips: { 1: "Nothing in the profile says that. Look at How to get in.", 2: "Every job has a way in. Look at How to get in." },
          hint: "Look at How to get in.",
          why: "The profile says: [[route]]." },
        spicy: { q: "Which job could a [[job]] move up to later?",
          options: ["[[Top]]", "Nothing: you stay the same forever", "The profile does not say"],
          slips: { 1: "The career path shows you can move up.", 2: "Have a look: there is a Career path line at the end." },
          hint: "Find the Career path line.",
          why: "The career path says: [[path]] You can move up with experience." } } },

    { type: "multi", topic: "Read a profile",
      q: "Pick the <b>two</b> things a [[job]] does.",
      options: ["[[Do1]]", "[[Do2]]", "Sell tickets at the door", "Drive a bus"],
      answers: [0, 1],
      hint: "Both are in the What you do section.",
      why: "The profile says you [[do1]], and you [[do2]]." },

    { type: "num", topic: "Read a profile", explain: true,
      q: "The profile says 40 hours a week, over 5 days. How many hours is that each day?",
      boxes: [{ label: "Hours a day", a: 8 }],
      slips: [[200, "That multiplies. Share the 40 hours between the 5 days."], [35, "That takes 5 away. Share 40 into 5 equal days instead."], [45, "That adds. Share the hours out instead."]],
      hint: "40 shared between 5.",
      why: "40 / 5 = <b>8</b> hours a day.",
      lv: { medium: { q: "Starting pay is &pound;21,600 a year. With experience it is &pound;32,000. How much more is that a year?",
          boxes: [{ label: "More a year", a: 10400, pre: "&pound;" }],
          slips: [[53600, "That adds them. Find the difference instead."], [11600, "Check the subtraction: 32,000 take away 21,600."], [10600, "Nearly. 32,000 - 21,600 = 10,400."]],
          hint: "32,000 take away 21,600.",
          why: "&pound;32,000 - &pound;21,600 = <b>&pound;10,400</b> more a year." },
        spicy: { q: "Starting pay is &pound;21,600 a year. Roughly how much is that a month, before tax?",
          boxes: [{ label: "A month", a: 1800, pre: "&pound;", tol: 1 }],
          slips: [[415.38, "That divides by 52, which gives a week, not a month."], [259200, "That multiplies. A month is a year divided by 12."], [2160, "That divides by 10. There are 12 months in a year."]],
          hint: "There are 12 months in a year.",
          why: "&pound;21,600 / 12 = <b>&pound;1,800</b> a month before tax." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Facts worth keeping", title: "Pick facts that are specific",
      fig: FACTS,
      html: "<p>A good fact is <b>specific</b>: it has a number, a place, a name or a clear thing you do. \"Works 40 hours a week\" tells you something. \"Does lots of stuff\" does not.</p>" +
        "<p>And an <b>interesting</b> fact is one that surprised you, or matters to you.</p>",
      lv: { spicy: { html: "<p>A good fact is <b>specific</b>: a number, a place, a name or a clear task. \"Works 40 hours a week\" tells you something; \"does lots of stuff\" does not; \"the best job ever\" is opinion.</p>" +
        "<p>Then put it in <b>your own words</b>. Copying a line straight off a website does not show you understood it. Change the wording, keep the meaning.</p>" +
        "<p>And check the <b>source</b>: an official careers website is more reliable than a random comment online.</p>" } } },

    { type: "mc", topic: "Facts worth keeping",
      q: "Which is the most useful fact about being a [[job]]?",
      options: ["Starting pay is about &pound;21,600 a year", "It is a job", "It is really, really good"],
      answer: 0,
      slips: { 1: "True, but it does not tell you anything new.", 2: "That is an opinion. Nobody could check it." },
      hint: "Which one has a number in it?",
      why: "It is specific: you could check it, and it tells you something real." },

    { type: "sort", topic: "Facts worth keeping",
      q: "Sort them. Fact you could keep, or not a fact?",
      buckets: ["A fact to keep", "Not a fact"],
      cards: [["[[Jobs]] work [[place]].", 0], ["[[Jobs]] are the coolest people.", 1], ["The job is 40 hours a week.", 0], ["Everyone would love this job.", 1]],
      hint: "Could you check it on the profile?",
      why: "Places and hours can be checked. Coolest and everyone would love it are opinions.",
      lv: { spicy: { cards: [["[[Jobs]] work [[place]].", 0], ["[[Jobs]] are the coolest people.", 1], ["The job is 40 hours a week.", 0], ["Everyone would love this job.", 1], ["[[Fact]]", 0], ["A comment online says it is easy money.", 1]],
          why: "Places, hours and the Did you know fact come from the profile. Opinions and random comments online are not facts to keep." } } },

    { type: "text", topic: "Facts worth keeping",
      q: "Write <b>one</b> fact about being a [[job]] from the profile, in your own words.",
      need: [["work", "works", "earn", "earns", "pay", "hours", "they", "you", "job", "can", "need", "some", "a", "the"]],
      model: "They work [[place]].",
      slips: [[["cool", "best", "amazing", "awesome", "love"], "That sounds like an opinion. Try something from the profile you could check, like the hours or where they work."]],
      hint: "Pick something from the Where, Hours or Pay sections.",
      why: "Any checkable detail works, such as \"They work [[place]]\" or \"It is 40 hours a week\".",
      lv: { spicy: { q: "Rewrite this in your own words, keeping the meaning: \"[[Fact]]\"",
          model: "[[Own]]",
          hint: "Start it differently, and swap a word or two. Keep the facts the same.",
          why: "Own words show you understood it. Keep the facts exact; change the wording." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Your career hunt", title: "Now try a real one, if you like",
      fig: HUNT,
      html: "<p>Real careers websites have hundreds of profiles. A good free one is the <b>National Careers Service</b>: look for <b>job profiles</b>.</p>" +
        "<p><b>1</b> Search for a job, or browse a list. <b>2</b> Read the profile. <b>3</b> Pick three facts that interest you. <b>4</b> Put them in your own words.</p>" },

    { type: "order", topic: "Your career hunt",
      q: "Put the career hunt in order.",
      items: ["Open a careers website", "Search for a job that sounds interesting", "Read the whole profile", "Pick three facts that interest you", "Write them in your own words"],
      hint: "Find it, read it, pick, write.",
      why: "Find a profile, read it all, pick three facts, then put them in your own words." },

    { type: "mc", topic: "Your career hunt",
      q: "You search for a job and it sounds boring after all. What now?",
      options: ["Try a different job: there are hundreds", "Stop exploring careers forever", "Pretend it is interesting"],
      answer: 0,
      slips: { 1: "One boring one does not mean they all are.", 2: "No need. Finding out you do not like something is useful too." },
      hint: "Exploring means trying a few.",
      why: "Ruling a job out is part of exploring. Pick another one and have a look.",
      lv: { spicy: { q: "You find a forum post saying \"[[Jobs]] earn millions\". The careers website says about &pound;32,000 with experience. Which do you trust more?",
          options: ["The careers website", "The forum post", "Neither, so give up"],
          slips: { 1: "Anyone can post anything. Who wrote it, and how do they know?", 2: "The careers website is a reliable source. Use that." },
          hint: "Who checked the information?",
          why: "Official careers websites check their figures. A random post has no one checking it." } } },

    { type: "widget", topic: "Your career hunt", unscored: true,
      title: "Career hunt",
      html: "<p>Pick where to start, and tick things off as you go. This bit happens on a real careers website.</p>",
      mount: huntWidget,
      report: function(d){ if(!d) return ""; var n = (d.ticks || []).filter(Boolean).length; var s = (STARTS.filter(function(x){ return x[0] === d.start; })[0] || [])[1]; return (s || n) ? "Career hunt: " + (s ? "started with " + s.toLowerCase() + ", " : "") + n + " of " + HUNT_TICKS.length + " ticked." : ""; } },

    { type: "write", topic: "Your career hunt",
      q: "After your hunt, tell Jay about the career you found, if you like. What is it, and would you want to do it? Why, or why not?",
      starters: ["I looked at", "One thing that surprised me was", "I would like it because", "I would not like it because"],
      checklist: ["The job I looked at", "Something that surprised me", "Would I want to do it, and why"],
      minWords: 25 }
  ],

  realWorld: {
    title: "Everyone uses these",
    html: "<p>Careers advisers, colleges and job centres use job profiles every day. When you choose a college course, they help you see where it could lead.</p>" +
      "<p>For our big question: jobs change over time. Before alarm clocks, some people were paid to tap on windows to wake workers up. If we could time travel, should we? Imagine telling them about phones that wake you up.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A time portal and a person with a long pole tapping on a window">' + A2ART.portal(80, 75, 56) +
      '<rect x="230" y="20" width="70" height="60" rx="4" fill="#fff" stroke="#141a33" stroke-width="3"/><path d="M265 20v60M230 50h70" stroke="#141a33" stroke-width="2"/>' +
      '<path d="M350 140l-56 -84" stroke="#7a5532" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="360" cy="78" r="14" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/><path d="M346 98q14 -10 28 0v40h-28z" fill="#5b6180"/>' +
      T(330, 18, "tap tap", 14, { b: 1 }) + '</svg>'
  },

  make: {
    title: "Make a career fact file",
    intro: "Three facts about one career, in your own words. Keep it, or send it to Jay.",
    fields: [
      { id: "job", label: "The career", ph: "Zookeeper", max: 30 },
      { id: "f1", label: "Fact 1", ph: "Zookeepers often start work at 7am.", max: 80 },
      { id: "f2", label: "Fact 2", ph: "You can get in through an apprenticeship.", max: 80 },
      { id: "f3", label: "Fact 3", ph: "Some zookeepers help breed rare animals.", max: 80 },
      { id: "name", label: "Explorer", ph: "Career Detective", max: 24 }
    ],
    svg: function(v){
      var job = wrap(v.job, 20, 2), nm = wrap(v.name, 22, 1), cols = ["#ffd23f", "#22b8e6", "#ff5d8f"];
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 460">' +
        '<rect width="640" height="460" rx="24" fill="#fdf6e3"/>' +
        '<path d="M30 70h170l20 -26h390v390h-580z" fill="#ffe7a8" stroke="#141a33" stroke-width="3"/>' +
        '<rect x="30" y="70" width="580" height="364" rx="6" fill="#fffbe9" stroke="#141a33" stroke-width="3"/>' +
        T(48, 62, "CAREER FACT FILE", 16, { b: 1, c: "#7a5532" }) +
        job.map(function(l, i){ return T(54, 112 + i * 30, esc(l), 26, { b: 1 }); }).join("") +
        [v.f1, v.f2, v.f3].map(function(f, k){
          var y = 168 + k * 82, ls = wrap(f, 44, 2);
          return '<circle cx="74" cy="' + (y + 22) + '" r="18" fill="' + cols[k] + '" stroke="#141a33" stroke-width="2.5"/>' + T(74, y + 29, String(k + 1), 18, { b: 1, a: "middle" }) +
            ls.map(function(l, i){ return T(104, y + 18 + i * 24, esc(l), 18); }).join("");
        }).join("") +
        T(586, 420, "Explorer: " + esc(nm[0] || ""), 15, { b: 1, a: "end", c: "#5b6180" }) +
        '<g transform="translate(560 112) rotate(-10)"><circle r="34" fill="none" stroke="#1f9d63" stroke-width="4"/>' + T(0, 6, "FOUND", 15, { b: 1, a: "middle", c: "#1f9d63" }) + '</g>' +
        '</svg>';
    }
  }
};
})();
