/* Base 5 core target activity: Who is it for?
   English. Choosing words that fit the reader and the job: formal and
   informal, a friend, a boss, a little kid, an advert. Replayable: most
   questions carry two more versions. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var LVS = ["mild", "medium", "spicy"], START = "mild";
function ext(a, b){ for(var k in b) if(Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function task(h){ return '<div class="a2task">' + h + '</div>'; }

/* Question builder: each version is {fields, medium:{...}, spicy:{...}}. o:[right, others] becomes
   options (the right one moves a place each version) and s:[slip for each other option] becomes
   slips. Version 1 is the base; the rest become vary, each with every level written out. */
function res(v, L, vi){
  var o = {};
  Object.keys(v).forEach(function(k){ if(LVS.indexOf(k) < 0 && k !== "ez") o[k] = v[k]; });
  if(v[L]) ext(o, v[L]);
  if(o.o){
    var right = o.o[0], rest = o.o.slice(1), t = vi % o.o.length, opts = rest.slice(), sl = {};
    opts.splice(t, 0, right);
    (o.s || []).forEach(function(m, j){ if(m) sl[j < t ? j : j + 1] = m; });
    o.options = opts; o.answer = t; o.slips = sl; delete o.o; delete o.s;
  }
  return o;
}
function Q(type, topic, flags, vers){
  var all = [], R = vers.map(function(v, vi){ var r = {}; LVS.forEach(function(L){ r[L] = res(v, L, vi); all.push(r[L]); }); return r; });
  var keys = {}; all.forEach(function(o){ Object.keys(o).forEach(function(k){ keys[k] = 1; }); });
  all.forEach(function(o){ Object.keys(keys).forEach(function(k){ if(!(k in o)) o[k] = null; }); });
  function others(r){ var lv = {}; LVS.forEach(function(L){ if(L !== START) lv[L] = r[L]; }); return lv; }
  var step = ext(ext({ type: type, topic: topic }, flags || {}), R[0][START]);
  step.lv = others(R[0]);
  if(R.length > 1) step.vary = R.slice(1).map(function(r){ return ext(ext({}, r[START]), { lv: others(r) }); });
  /* easy read (LC): a version's ez goes on the first level only. Its s becomes slips, moved round just as res() moves them. */
  vers.forEach(function(v, vi){ var e = ezOf(v, vi); if(e){ if(vi) step.vary[vi - 1].ez = e; else step.ez = e; } });
  return step;
}
function ezOf(v, vi){
  if(!v.ez) return null;
  var e = ext({}, v.ez), oo = (v[START] && v[START].o) || v.o;
  if(e.s && oo){ var t = vi % oo.length, sl = {}; e.s.forEach(function(m, j){ if(m) sl[j < t ? j : j + 1] = m; }); e.slips = sl; delete e.s; }
  return e;
}

/* ---------- pictures ---------- */
function shoe(x, y, col){ return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-40 0q0 -24 18 -26l18 14q22 4 42 6q10 2 10 12v6h-88z" fill="' + col + '" stroke="#141a33" stroke-width="2.5" stroke-linejoin="round"/><path d="M-40 12h88" stroke="#ffffff" stroke-width="4"/><path d="M-16 -16l6 6M-8 -12l6 6" stroke="#ffffff" stroke-width="2.5"/></g>'; }
function tie(x, y){ return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-22 -26l22 10 22 -10v20l-22 -10 -22 10z" fill="#141a33"/><circle cx="0" cy="-16" r="5" fill="#141a33"/></g>'; }

/* dressed down, dressed up */
var WARDROBE = '<svg viewBox="0 0 540 230" role="img" aria-label="Words can be dressed down like trainers, for friends: Hiya, cheers. Or dressed up like a bow tie, for people you do not know well: Dear Mrs Shah, thank you very much">' +
  '<rect width="540" height="230" rx="16" fill="#f4f1ea"/>' +
  '<rect x="18" y="16" width="244" height="198" rx="16" fill="#fff1e0" stroke="#141a33" stroke-width="2.5"/>' +
  T(140, 46, "Informal", 18, { a: "middle", b: 1 }) + T(140, 68, "chatty, for friends", 13, { a: "middle", c: "#5b6180" }) + shoe(140, 108, "#ff8a5c") +
  T(140, 150, "Hiya!", 16, { a: "middle", b: 1 }) + T(140, 174, "Cheers, see ya!", 16, { a: "middle", b: 1 }) + T(140, 198, "can't, gonna, loads", 13, { a: "middle", c: "#5b6180" }) +
  '<rect x="278" y="16" width="244" height="198" rx="16" fill="#e8f0ff" stroke="#141a33" stroke-width="2.5"/>' +
  T(400, 46, "Formal", 18, { a: "middle", b: 1 }) + T(400, 68, "polite, for people you do not know", 13, { a: "middle", c: "#5b6180" }) + tie(400, 112) +
  T(400, 150, "Dear Mrs Shah,", 16, { a: "middle", b: 1 }) + T(400, 174, "Thank you very much.", 16, { a: "middle", b: 1 }) + T(400, 198, "cannot, going to, a lot", 13, { a: "middle", c: "#5b6180" }) +
  A.egg('<g transform="translate(488 104)">' + A.bonnie(0, 0, 0.42, "sit") + tie(0, 6).replace('translate(0 6)', 'translate(0 6) scale(.45)') + '</g>', "Bonnie, dressed up for a formal letter. She is still not allowed in the staff room.") +
  '</svg>';

/* four kinds of reader */
function face(x, y, col, extra){ return '<g transform="translate(' + x + ' ' + y + ')"><circle r="26" fill="#f6d1b0" stroke="#141a33" stroke-width="2.5"/><circle cx="-9" cy="-4" r="3" fill="#141a33"/><circle cx="9" cy="-4" r="3" fill="#141a33"/><path d="M-8 9q8 6 16 0" fill="none" stroke="#141a33" stroke-width="2.5" stroke-linecap="round"/><path d="M-34 60q0 -30 34 -30q34 0 34 30z" fill="' + col + '" stroke="#141a33" stroke-width="2.5"/>' + (extra || "") + '</g>'; }
var READERS = '<svg viewBox="0 0 560 240" role="img" aria-label="Four readers: a friend gets chatty words, a boss gets polite words, a little kid gets simple fun words, an advert reader gets exciting words">' +
  '<rect width="560" height="240" rx="16" fill="#f4f1ea"/>' +
  [["Friend", "#ff8a5c", "Guess what!", ""], ["Boss", "#3a4060", "Good morning.", '<path d="M-6 30l6 14 6 -14z" fill="#e04848"/>'], ["Little kid", "#ffd23f", "Ta da! Wow!", ""], ["Advert reader", "#19c39a", "Only 3 pounds!", ""]].map(function(r, k){
    var x = 70 + k * 140, sc = k === 2 ? 0.75 : 1;
    return '<rect x="' + (x - 62) + '" y="14" width="124" height="44" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(x, 42, r[2], 13, { a: "middle", b: 1 }) +
      '<g transform="translate(' + x + ' ' + (k === 2 ? 128 : 116) + ') scale(' + sc + ')">' + face(0, 0, r[1], r[3]) + '</g>' +
      T(x, 214, r[0], 15, { a: "middle", b: 1 });
  }).join("") +
  '</svg>';

/* the word swap, step by step */
var SWAP = '<svg viewBox="0 0 540 244" role="img" aria-label="Dressing a message up: Hiya becomes Dear Mr Khan, gonna becomes going to, loads becomes a lot, cheers becomes thank you">' +
  '<rect width="540" height="244" rx="16" fill="#f4f1ea"/>' +
  T(130, 34, "Chatty", 16, { a: "middle", b: 1, c: "#c25400" }) + T(410, 34, "Dressed up", 16, { a: "middle", b: 1, c: "#2d4a9a" }) +
  [["Hiya", "Dear Mr Khan,"], ["gonna", "going to"], ["loads", "a lot"], ["cheers", "thank you"]].map(function(p, k){
    var y = 52 + k * 42;
    return '<rect x="40" y="' + y + '" width="180" height="32" rx="10" fill="#fff1e0" stroke="#141a33" stroke-width="2"/>' + T(130, y + 22, p[0], 15, { a: "middle", b: 1 }) +
      '<path d="M232 ' + (y + 16) + 'h66" stroke="#141a33" stroke-width="3"/><path d="M294 ' + (y + 8) + 'l12 8 -12 8z" fill="#141a33"/>' +
      '<rect x="320" y="' + y + '" width="180" height="32" rx="10" fill="#e8f0ff" stroke="#141a33" stroke-width="2"/>' + T(410, y + 22, p[1], 15, { a: "middle", b: 1 });
  }).join("") +
  T(270, 232, "1. Greeting   2. Chatty words   3. Full sentences and sign off", 12, { a: "middle", c: "#3a4060" }).replace(/   /g, ", ") +
  '</svg>';

/* an advert, with its tricks labelled */
var ADVERT = '<svg viewBox="0 0 540 250" role="img" aria-label="An advert with its tricks labelled: a question hook, talking to you, exciting words, a deal, and telling you to act now">' +
  '<rect width="540" height="250" rx="16" fill="#f4f1ea"/>' +
  '<rect x="24" y="14" width="250" height="222" rx="12" fill="#ffd23f" stroke="#141a33" stroke-width="3"/>' +
  T(149, 50, "Bored on Saturday?", 18, { a: "middle", b: 1 }) +
  T(149, 86, "Try our AMAZING", 16, { a: "middle", b: 1, c: "#c2185b" }) + T(149, 108, "bird watching walks!", 16, { a: "middle", b: 1, c: "#c2185b" }) +
  T(149, 144, "You will love it.", 15, { a: "middle" }) +
  '<rect x="60" y="160" width="178" height="30" rx="15" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(149, 181, "Only 2 pounds!", 15, { a: "middle", b: 1 }) +
  T(149, 220, "BOOK NOW!", 18, { a: "middle", b: 1, c: "#e04848" }) +
  A.bird(242, 140, 0.6, "#3a8fd6") +
  [[44, "Question hook"], [96, "Exciting words"], [140, "Talks to you"], [176, "A deal"], [214, "Act now!"]].map(function(l){
    return '<path d="M262 ' + (l[0] - 5) + 'H318" stroke="#141a33" stroke-width="1.5" stroke-dasharray="4 3"/>' + T(324, l[0], l[1], 14, { b: 1, c: "#8a3a00" });
  }).join("") +
  '</svg>';

(window.A2PACKS = window.A2PACKS || {})["core-who-is-it-for"] = {
  a2: true,
  id: "a2-core-who-is-it-for",
  title: "Who is it for?",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 20,
  line: "The same message can be dressed up or dressed down. Pick the words that fit the reader.",
  blurb: "Words for a friend, a boss, a little kid or an advert. Four short chunks: formal and informal, who is reading, swapping chatty words for polite ones, and adverts. A two ways card to make at the end. The questions change each time you come back.",
  note: "Who is it for? Picking words that fit the reader: a friend, a boss, a little kid, an advert. Four five minute chunks and a card to make. The questions change every go, so come back whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Trainers", line: "Trainers: friend or boss, chatty or polite, one choice at a time." },
    { id: "medium", name: "Smart casual", line: "Smart casual: more readers, swapping words, and how adverts work." },
    { id: "spicy", name: "Black tie", line: "Black tie: fine tuning tone, formal phrases and persuasive tricks." }
  ],
  themes: {
    time: { name: "Time travel", w: { boss: "the head of the Time Travel Agency", ad: "time machine trips", job: "tour guide in the year 1850" } },
    football: { name: "Football", w: { boss: "the club manager", ad: "football coaching sessions", job: "helper at the football camp" } },
    horror: { name: "Horror", w: { boss: "the owner of the haunted hotel", ad: "midnight ghost tours", job: "guide on the ghost tour" } },
    fishing: { name: "Fishing", w: { boss: "the owner of the tackle shop", ad: "fishing lessons", job: "helper at the tackle shop" } },
    music: { name: "Music", w: { boss: "the manager of the music shop", ad: "guitar lessons", job: "helper at the music shop" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: WARDROBE,
  steps: [

    /* ---------- chunk 1: formal and informal ---------- */
    { type: "learn", topic: "Dress it up or down", title: "Words can be dressed up or down",
      fig: WARDROBE,
      ez: { title: "Dressed up or down", html: "<p><b>Informal</b> is chatty, for friends. Hiya! Cheers!</p><p><b>Formal</b> is polite, for a boss. Dear Mrs Shah.</p>" },
      html: "<p>You would not wear the same clothes to the beach and to a wedding. Words are the same.</p>" +
        "<p><b>Informal</b> words are chatty, like trainers: <b>Hiya! Cheers!</b> They are for friends and family.</p>" +
        "<p><b>Formal</b> words are dressed up, like a bow tie: <b>Dear Mrs Shah, thank you very much.</b> They are for people you do not know well, like a boss.</p>",
      lv: {
        medium: { html: "<p>Words can be <b>informal</b> (chatty, relaxed) or <b>formal</b> (polite, careful). Neither is better. It depends on <b>who is reading</b>.</p>" +
          "<p>Informal: slang (<b>gonna, loads, cheers</b>), short forms (<b>can't, I'm</b>), emojis, exclamation marks.</p>" +
          "<p>Formal: full words (<b>cannot, I am</b>), polite phrases (<b>Could I ask...</b>, <b>Thank you for...</b>), no slang.</p>" },
        spicy: { html: "<p>Formality is a scale, not a switch. A text to a mate, a message to a coach, an email to a manager and a letter to a company all sit at different points on it.</p>" +
          "<p>Moving up the scale: contractions go (<b>I'm</b> becomes <b>I am</b>), slang goes, requests become indirect (<b>Can I...</b> becomes <b>I would be grateful if...</b>), and the writer sounds more distant.</p>" +
          "<p>The skill is landing at the right point. Too formal with a friend sounds cold or sarcastic; too chatty with a manager sounds careless.</p>" } } },

    Q("sort", "Dress it up or down", null, [
      { q: "Sort them. Dressed up (formal) or chatty (informal)?",
        buckets: ["Formal", "Informal"],
        cards: [["Dear Mr Khan,", 0], ["Thank you very much.", 0], ["Hiya!", 1], ["Cheers mate!", 1]],
        ez: { q: "Sort them. Formal or chatty?", hint: "Best mate, or head teacher?", why: "Dear and thank you are formal. Hiya and cheers are chatty." },
        hint: "Would you say it to your best mate, or to a head teacher?",
        why: "Dear and thank you very much are dressed up. Hiya and cheers are chatty.",
        medium: { cards: [["Dear Mr Khan,", 0], ["Thank you very much.", 0], ["I am looking forward to it.", 0], ["Hiya!", 1], ["Cheers mate!", 1], ["Can't wait!!", 1]],
          why: "Full words and polite phrases are formal. Slang, short forms and lots of exclamation marks are informal." },
        spicy: { cards: [["I would be grateful if you could reply.", 0], ["I am writing to ask about the job.", 0], ["Please find my details below.", 0], ["Gimme a shout.", 1], ["I'm well up for it.", 1], ["No worries, catch you later.", 1], ["Can you get back to me?", 1]],
          why: "Can you get back to me is polite but casual. The formal version would be: I would be grateful if you could reply." } },
      { q: "Sort them. Dressed up (formal) or chatty (informal)?",
        buckets: ["Formal", "Informal"],
        cards: [["Good morning.", 0], ["Yours sincerely,", 0], ["Yo!", 1], ["See ya!", 1]],
        ez: { q: "Sort them. Formal or chatty?", hint: "Which goes in a letter?", why: "Good morning is formal. Yo is chatty." },
        hint: "Which would you put in a letter to a stranger?",
        why: "Good morning and Yours sincerely are dressed up. Yo and see ya are chatty.",
        medium: { cards: [["Good morning.", 0], ["Yours sincerely,", 0], ["Could I ask a question?", 0], ["Yo!", 1], ["See ya!", 1], ["Gonna be late, soz", 1]],
          why: "Polite phrases are formal. Slang and short forms are informal." },
        spicy: { cards: [["I apologise for the delay.", 0], ["Please accept my thanks.", 0], ["I would welcome the chance to discuss this.", 0], ["Soz for being late.", 1], ["Ta very much.", 1], ["Let's have a chat.", 1], ["Sorry I'm late!", 1]],
          why: "Sorry I'm late is polite, but the short form I'm and the exclamation mark keep it informal." } },
      { q: "Sort them. Dressed up (formal) or chatty (informal)?",
        buckets: ["Formal", "Informal"],
        cards: [["Kind regards,", 0], ["I am sorry I was late.", 0], ["Soz!", 1], ["That's well good!", 1]],
        ez: { q: "Sort them. Formal or chatty?", hint: "Which would you send a boss?", why: "Kind regards is formal. Soz is chatty." },
        hint: "Which would you send to a boss?",
        why: "Kind regards and I am sorry are dressed up. Soz and well good are chatty.",
        medium: { cards: [["Kind regards,", 0], ["I am sorry I was late.", 0], ["Thank you for your help.", 0], ["Soz!", 1], ["That's well good!", 1], ["Laters!", 1]],
          why: "Full words and polite phrases are formal. Slang is informal." },
        spicy: { cards: [["I would like to thank you for your support.", 0], ["Your help was much appreciated.", 0], ["I look forward to hearing from you.", 0], ["Thanks a mil!", 1], ["You're a legend.", 1], ["Hope to hear back soon!", 1], ["Thanks loads for your help.", 1]],
          why: "Hope to hear back soon is friendly, but the exclamation mark and missing I keep it informal." } }
    ]),

    Q("mc", "Dress it up or down", null, [
      { q: "Which would you say to [[boss]], who you have just met?",
        o: ["Good morning. Could I ask you a question?", "Oi! Got a sec?", "Yo, wassup?"],
        s: ["Oi sounds rude to someone you have just met.", "Fine with a mate, but too chatty for a boss."],
        ez: { q: "You just met [[boss]]. What do you say?", s: ["Oi sounds rude here.", "Too chatty for a boss."], why: "A new boss gets polite words." },
        hint: "Dressed up or dressed down?",
        why: "A boss you have just met gets polite, dressed up words.",
        spicy: { o: ["Excuse me, would you have a moment to answer a question?", "Got a minute? Need to ask you something.", "Hello mate, quick question!"],
          s: ["Missing words (Got a minute? Need to...) keep it chatty.", "Mate is far too familiar for a manager you have just met."] } },
      { q: "Which would you text to your best friend?",
        o: ["See you at 4!", "I look forward to meeting you at 4pm.", "Dear friend, I confirm our meeting."],
        s: ["Correct English, but it sounds odd to a best friend. Too dressed up.", "Your friend might think you have been taken over by a robot."],
        ez: { q: "Which would you text your best friend?", s: ["Too dressed up for a friend.", "Your friend might think you are a robot."], why: "Short and chatty suits a friend." },
        hint: "Friends get chatty words.",
        why: "Short and chatty is perfect for a best friend.",
        spicy: { o: ["Still on for 4? Can't wait!", "I would be grateful if you could confirm 4pm.", "Please be advised that I will arrive at 4pm."],
          s: ["Far too formal for a best friend. It could even sound sarcastic.", "That sounds like a letter from the council."] } },
      { q: "Which would you say to a friend's mum, who you do not know well?",
        o: ["Thank you for having me over.", "Ta for the grub!", "Cheers, love it!"],
        s: ["Grub is slang. A bit too chatty for someone you do not know well.", "Friendly, but chatty. A little more polite fits better here."],
        ez: { q: "Which would you say to a friend's mum?", s: ["Grub is slang. A bit too chatty.", "Friendly, but a bit too chatty."], hint: "Be a bit more polite.", why: "Polite and friendly is just right." },
        hint: "Someone you do not know well gets a bit more polite.",
        why: "Polite and friendly: just right for someone you do not know well.",
        spicy: { o: ["Thank you so much for having me, it was lovely.", "I wish to express my gratitude for your hospitality.", "Cheers for that, it was class."],
          s: ["Too formal: it sounds like a speech, not a thank you to a person.", "Too chatty for someone you do not know well."],
          why: "Warm and polite: the middle of the scale." } }
    ]),

    Q("match", "Dress it up or down", null, [
      { q: "Match each reader to the greeting that fits.",
        pairs: [["Your best friend", "Hiya!"], ["A head teacher you have never met", "Dear Mrs Shah,"], ["A little kid", "Hello there!"]],
        ez: { q: "Match each reader to a greeting.", hint: "Who gets the most dressed up one?", why: "Each reader gets a greeting that fits." },
        hint: "Which reader gets the most dressed up greeting?",
        why: "Chatty for a friend, dressed up for a head teacher, warm and simple for a little kid.",
        medium: { pairs: [["Your best friend", "Hiya!"], ["A head teacher you have never met", "Dear Mrs Shah,"], ["A little kid", "Hello there!"], ["A company, name unknown", "Dear Sir or Madam,"]] },
        spicy: { pairs: [["Your best friend", "Hiya!"], ["A coach you know well", "Hi Coach,"], ["A head teacher you have never met", "Dear Mrs Shah,"], ["A company, name unknown", "Dear Sir or Madam,"], ["A whole room of people at an event", "Good evening, everyone."]] } },
      { q: "Match each reader to the sign off that fits.",
        pairs: [["Your best friend", "See ya!"], ["[[Boss]]", "Kind regards,"], ["A little kid", "Have fun!"]],
        ez: { q: "Match each reader to a sign off.", hint: "Who gets the most dressed up one?", why: "Each reader gets a sign off that fits." },
        hint: "Which reader gets the most dressed up sign off?",
        why: "Chatty for a friend, dressed up for a boss, warm and simple for a little kid.",
        medium: { pairs: [["Your best friend", "See ya!"], ["[[Boss]]", "Kind regards,"], ["A little kid", "Have fun!"], ["Your gran", "Lots of love,"]] },
        spicy: { pairs: [["Your best friend", "See ya!"], ["A teacher you know well", "Thanks,"], ["[[Boss]]", "Kind regards,"], ["A company, name unknown", "Yours faithfully,"], ["A named stranger", "Yours sincerely,"]] } },
      { q: "Match each reader to the best way to say thank you.",
        pairs: [["Your best friend", "Cheers!"], ["[[Boss]]", "Thank you for your time."], ["A little kid", "You are a superstar!"]],
        ez: { q: "Match each reader to a thank you.", hint: "What would a boss expect?", why: "Each reader gets words that fit." },
        hint: "Which one sounds like a boss would expect?",
        why: "Each reader gets words that fit them.",
        medium: { pairs: [["Your best friend", "Cheers!"], ["[[Boss]]", "Thank you for your time."], ["A little kid", "You are a superstar!"], ["A friend's parent", "Thank you so much for having me."]] },
        spicy: { pairs: [["Your best friend", "Cheers!"], ["A friend's parent", "Thank you so much for having me."], ["[[Boss]]", "Thank you for your time."], ["A company that gave you work experience", "I am very grateful for the opportunity."], ["A little kid", "You are a superstar!"]] } }
    ]),

    Q("order", "Dress it up or down", null, [
      { q: "Put these greetings in order, from the most chatty to the most dressed up.",
        items: ["Yo!", "Hello.", "Dear Sir or Madam,"],
        ez: { q: "Put them in order. Most chatty first.", hint: "Which is only for a letter?", why: "Yo is most chatty. Dear Sir or Madam is most dressed up." },
        hint: "Which one would you only use in a formal letter?",
        why: "Yo is the most chatty, Dear Sir or Madam is the most dressed up.",
        medium: { items: ["Yo!", "Hiya!", "Good morning.", "Dear Sir or Madam,"] },
        spicy: { items: ["Oi oi!", "Hiya!", "Hello.", "Good morning.", "Dear Sir or Madam,"] } },
      { q: "Put these in order, from the most chatty to the most dressed up.",
        items: ["Ta!", "Thanks.", "Thank you very much."],
        ez: { q: "Put them in order. Most chatty first.", hint: "Which has the most careful words?", why: "Ta is most chatty. Thank you very much is most dressed up." },
        hint: "Which uses the most full, careful words?",
        why: "Ta is the most chatty, thank you very much is the most dressed up.",
        medium: { items: ["Ta!", "Cheers.", "Thanks very much.", "Thank you for your help."] },
        spicy: { items: ["Ta!", "Cheers.", "Thanks very much.", "Thank you for your help.", "I am extremely grateful for your assistance."] } },
      { q: "Put these in order, from the most chatty to the most dressed up.",
        items: ["Soz!", "Sorry.", "I am very sorry."],
        ez: { q: "Put them in order. Most chatty first.", hint: "Which has the most careful words?", why: "Soz is most chatty. I am very sorry is most dressed up." },
        hint: "Which uses the most full, careful words?",
        why: "Soz is the most chatty, I am very sorry is the most dressed up.",
        medium: { items: ["Soz!", "Sorry!", "I am sorry.", "I apologise."] },
        spicy: { items: ["Soz!", "Sorry!", "I am sorry.", "I apologise for the delay.", "Please accept my sincere apologies."] } }
    ]),

    /* ---------- chunk 2: who is reading? ---------- */
    { type: "learn", topic: "Who is reading?", title: "Think about the reader",
      fig: READERS,
      ez: { title: "Who is reading?", html: "<p>Ask: <b>who is reading?</b></p><p>Friend: chatty. Boss: polite. Kid: simple and fun. Advert: exciting.</p>" },
      html: "<p>Before you write, ask: <b>who is going to read this?</b></p>" +
        "<p>A <b>friend</b> gets chatty words. A <b>boss</b> gets polite words. A <b>little kid</b> gets short, simple, fun words. An <b>advert</b> uses exciting words to get people to buy.</p>",
      lv: {
        medium: { html: "<p>Every piece of writing has an <b>audience</b> (who reads it) and a <b>purpose</b> (what it is for).</p>" +
          "<p><b>Friend:</b> chatty, jokes, short forms. <b>Boss:</b> polite, clear, full sentences. <b>Little kid:</b> short sentences, simple words, fun and encouraging. <b>Advert:</b> talks to <b>you</b>, exciting words, wants you to act.</p>" +
          "<p>Purposes: to <b>tell</b> (inform), to <b>show how</b> (instruct), to <b>get someone to do something</b> (persuade), to <b>entertain</b>.</p>" },
        spicy: { html: "<p>Audience and purpose decide almost every word choice: vocabulary, sentence length, tone, even punctuation.</p>" +
          "<p>A leaflet about healthy teeth for 6 year olds and one for dentists say the same thing, but share almost no sentences. Writers often have a <b>mixed</b> audience (parents and children) or a <b>mixed</b> purpose (to inform and persuade), and balance both.</p>" +
          "<p>Ask: who, what do they already know, what do I want them to think or do?</p>" } } },

    Q("mc", "Who is reading?", null, [
      { q: "Which sentence is written for a <b>little kid</b>?",
        o: ["Brush your teeth so they stay shiny and strong!", "Dental hygiene is essential for long term health.", "Brush ur teeth innit"],
        s: ["Long, hard words. Great for adults, too tricky for a little kid.", "That is how teenagers text, not how you talk to a little kid."],
        ez: { q: "Which one is for a <b>little kid</b>?", s: ["Too many hard words for a kid.", "That is how teens text."], why: "Short, simple and fun." },
        hint: "Short, simple, fun.",
        why: "Short, simple words, and fun (shiny and strong!).",
        spicy: { q: "A leaflet about teeth is for <b>6 year olds</b>. Which sentence fits best?",
          o: ["Brush twice a day to keep the sugar bugs away!", "Brushing twice a day reduces the risk of tooth decay.", "Regular brushing is recommended by dental professionals."],
          s: ["Clear and correct, but reduces the risk of decay is grown up language.", "Far too formal for a 6 year old."],
          why: "Short, playful and memorable: the sugar bugs make it stick." } },
      { q: "Which sentence is written for a <b>boss</b>?",
        o: ["I am sorry, but I cannot work on Monday.", "Can't do Monday, soz!", "Monday is a NO from me lol"],
        s: ["Short forms and soz are chatty.", "Lol and capitals are for friends."],
        ez: { q: "Which one is for a <b>boss</b>?", s: ["Soz is chatty.", "Lol is for friends."], hint: "Polite, full words.", why: "Full words, and it says sorry." },
        hint: "Polite and full words.",
        why: "Full words (I am, cannot) and polite (I am sorry).",
        spicy: { q: "You need to tell [[boss]] you cannot work on Monday. Which is best?",
          o: ["I am sorry, but I will not be able to work on Monday. Could I swap to Tuesday?", "I can't make Monday, sorry! Tuesday?", "I hereby inform you of my unavailability on Monday."],
          s: ["Friendly, but the short form and the one word question are too casual.", "Too stiff: it sounds like a legal document, not a person."],
          why: "Polite, clear, and it offers a solution." } },
      { q: "Which sentence is from an <b>advert</b>?",
        o: ["Hungry? Grab a hot pizza for just 3 pounds!", "Pizza is a food made from dough.", "Dear Sir, I am writing about a pizza."],
        s: ["That is a fact, like an information book. It does not try to sell you anything.", "That is the start of a formal letter."],
        ez: { q: "Which one is from an <b>advert</b>?", s: ["That is just a fact.", "That starts a formal letter."], why: "It hooks you and gives a deal." },
        hint: "Adverts want you to buy.",
        why: "A question to hook you, talking to you, and a deal. That is an advert.",
        spicy: { q: "Which line would persuade a busy parent most?",
          o: ["Tea sorted in 10 minutes. Your family will thank you.", "Our pizzas contain wheat flour, tomato and cheese.", "We sell a range of pizzas at various prices."],
          s: ["Information, but no reason for this reader to care.", "Flat and vague: nothing for a busy parent."],
          why: "It speaks to what that reader wants: time, and a happy family." } }
    ]),

    Q("sort", "Who is reading?", { explain: true }, [
      { q: "Who is each message for? Sort them.",
        buckets: ["A friend", "A boss"],
        cards: [["Fancy the park later?", 0], ["LOL that was so funny", 0], ["Thank you for the job offer.", 1], ["Could I leave early on Friday?", 1]],
        ez: { q: "Who is each one for? Sort them.", why: "Chatty for a friend. Polite for a boss." },
        hint: "Chatty for a friend, polite for a boss.",
        why: "Chatty messages for a friend, polite ones for a boss.",
        medium: { buckets: ["A friend", "A boss", "A little kid"],
          cards: [["Fancy the park later?", 0], ["LOL that was so funny", 0], ["Thank you for the job offer.", 1], ["Could I leave early on Friday?", 1], ["Wow, you built a tower! Well done!", 2], ["Let's count the ducks: one, two, three!", 2]],
          why: "Chatty for a friend, polite for a boss, simple and fun for a little kid." },
        spicy: { buckets: ["A friend", "A boss", "A little kid", "An advert reader"],
          cards: [["Fancy the park later?", 0], ["Could I leave early on Friday?", 1], ["Please find my timesheet attached.", 1], ["Wow, you built a tower!", 2], ["Let's count the ducks!", 2], ["Don't miss out: [[ad]], half price!", 3], ["Want to learn something new this summer?", 3]],
          why: "A question can be for an advert too: it hooks the reader and gets them thinking about buying." } },
      { q: "Who is each message for? Sort them.",
        buckets: ["A friend", "A boss"],
        cards: [["Omg guess what!!", 0], ["Ur coming tonight yeah?", 0], ["I have attached my form.", 1], ["I look forward to starting on Monday.", 1]],
        ez: { q: "Who is each one for? Sort them.", why: "Chatty for a friend. Polite for a boss." },
        hint: "Chatty for a friend, polite for a boss.",
        why: "Chatty for a friend, polite for a boss.",
        medium: { buckets: ["A friend", "A boss", "A little kid"],
          cards: [["Omg guess what!!", 0], ["Ur coming tonight yeah?", 0], ["I have attached my form.", 1], ["I look forward to starting on Monday.", 1], ["Time for bed, sleepyhead!", 2], ["Can you find the red ball?", 2]] },
        spicy: { buckets: ["A friend", "A boss", "A little kid", "An advert reader"],
          cards: [["Omg guess what!!", 0], ["I have attached my form.", 1], ["I look forward to starting on Monday.", 1], ["Time for bed, sleepyhead!", 2], ["Can you find the red ball?", 2], ["Book [[ad]] today and save 20 percent!", 3], ["Only 5 places left!", 3]],
          why: "Only 5 places left is an advert trick: it makes you feel you must act now." } },
      { q: "Who is each message for? Sort them.",
        buckets: ["A friend", "A boss"],
        cards: [["That film was class!", 0], ["See ya at mine", 0], ["Thank you for your time today.", 1], ["I am sorry I was late this morning.", 1]],
        ez: { q: "Who is each one for? Sort them.", why: "Chatty for a friend. Polite for a boss." },
        hint: "Chatty for a friend, polite for a boss.",
        why: "Chatty for a friend, polite for a boss.",
        medium: { buckets: ["A friend", "A boss", "A little kid"],
          cards: [["That film was class!", 0], ["See ya at mine", 0], ["Thank you for your time today.", 1], ["I am sorry I was late this morning.", 1], ["Look, a bird! Can you say tweet tweet?", 2], ["You are the best painter ever!", 2]] },
        spicy: { buckets: ["A friend", "A boss", "A little kid", "An advert reader"],
          cards: [["That film was class!", 0], ["Thank you for your time today.", 1], ["I am sorry I was late this morning.", 1], ["Look, a bird! Can you say tweet tweet?", 2], ["You are the best painter ever!", 2], ["Treat yourself. You deserve it.", 3], ["Join today and get your first month free!", 3]],
          why: "You deserve it flatters the reader: a classic advert trick." } }
    ]),

    Q("mc", "Who is reading?", null, [
      { q: "What is this text trying to do?" + task("Come to our cake sale! Friday, 3pm. Every cake only 50p!"),
        o: ["Get you to come and buy", "Tell you how to bake a cake", "Tell a friend some news"],
        s: ["There are no steps to follow.", "It is written for everyone, not one friend."],
        ez: { q: "What does this text want?" + task("Come to our cake sale! Friday, 3pm. Every cake only 50p!"), s: ["There are no steps.", "It is for everyone, not one friend."], why: "It wants you to come and buy." },
        hint: "What does it want you to do?",
        why: "It wants you to come and spend money: it is persuading.",
        medium: { o: ["To persuade", "To instruct", "To inform"], s: ["Instructions tell you how to do something step by step.", "It does give facts, but its main job is to get you there."] },
        spicy: { q: "What is the main purpose, and who is the audience?" + task("Come to our cake sale! Friday, 3pm. Every cake only 50p!"),
          o: ["To persuade students and families to come and buy", "To instruct bakers how to make cakes", "To inform the head teacher of the sale times"],
          s: ["There are no instructions.", "The head teacher might read it, but the exclamation marks and the price are aimed at buyers."] } },
      { q: "What is this text trying to do?" + task("1. Fill the kettle. 2. Switch it on. 3. Wait for it to boil."),
        o: ["Tell you how to do something", "Get you to buy a kettle", "Tell a friend some news"],
        s: ["It does not try to sell anything.", "It is just steps, not news."],
        ez: { q: "What does this text want?" + task("1. Fill the kettle. 2. Switch it on. 3. Wait for it to boil."), s: ["It does not sell anything.", "It is steps, not news."], why: "Numbered steps show you how." },
        hint: "Look at the numbers.",
        why: "Numbered steps tell you how to do something: it is instructing.",
        medium: { o: ["To instruct", "To persuade", "To entertain"], s: ["It does not try to get you to buy or do anything except boil water.", "Not much of a story."] },
        spicy: { q: "What is the main purpose, and who is the audience?" + task("1. Fill the kettle. 2. Switch it on. 3. Wait for it to boil."),
          o: ["To instruct someone who has never used a kettle", "To persuade people to buy kettles", "To inform experts about how kettles work"],
          s: ["No selling at all.", "An expert would not need step 1."] } },
      { q: "What is this text trying to do?" + task("Guess what! Bonnie got a new ball and she has already chewed it. Ha!"),
        o: ["Tell a friend some news", "Get you to buy a ball", "Tell you how to train a dog"],
        s: ["It does not try to sell anything.", "There are no steps or tips."],
        ez: { q: "What does this text want?" + task("Guess what! Bonnie got a new ball and she has already chewed it. Ha!"), s: ["It does not sell anything.", "There are no steps."], why: "Chatty news for a friend." },
        hint: "Who might send this?",
        why: "Chatty news for a friend.",
        medium: { o: ["To share news and entertain a friend", "To persuade", "To instruct"], s: ["Nothing is being sold.", "There are no steps."] },
        spicy: { q: "What is the main purpose, and who is the audience?" + task("Guess what! Bonnie got a new ball and she has already chewed it. Ha!"),
          o: ["To entertain a friend who knows Bonnie", "To inform a vet about Bonnie's health", "To persuade a shop to give a refund"],
          s: ["A vet would need facts, not Ha!", "There is no complaint and no request."] } }
    ]),

    /* ---------- chunk 3: swap the words (worked example, then fade) ---------- */
    { type: "learn", topic: "Swap the words", title: "Watch a message get dressed up",
      fig: SWAP,
      ez: { title: "Dress up a message", html: "<p>Dress it up for Mr Khan.</p>" + task("Hiya, I'm gonna be late Saturday. Loads of traffic. Cheers!") +
        "<p>Hiya becomes <b>Dear Mr Khan</b>. Gonna becomes <b>going to</b>.</p>" +
        task("Dear Mr Khan,<br>I am going to be late on Saturday, because there is a lot of traffic. Thank you for understanding.<br>Kind regards, Jay") },
      html: "<p>Here is a chatty message. It needs to go to Mr Khan, the club manager:</p>" +
        task("Hiya, I'm gonna be late Saturday. Loads of traffic. Cheers!") +
        "<p><b>1. Greeting:</b> Hiya becomes <b>Dear Mr Khan,</b></p>" +
        "<p><b>2. Chatty words:</b> I'm becomes <b>I am</b>, gonna becomes <b>going to</b>, loads becomes <b>a lot</b>, cheers becomes <b>thank you</b>.</p>" +
        "<p><b>3. Full sentences and a sign off:</b></p>" +
        task("Dear Mr Khan,<br>I am going to be late on Saturday, because there is a lot of traffic. Thank you for understanding.<br>Kind regards, Jay"),
      lv: { spicy: { html: "<p>Here is a chatty message to Mr Khan, the club manager:</p>" +
        task("Hiya, I'm gonna be late Saturday. Loads of traffic, nothing I can do. Cheers!") +
        "<p><b>1. Greeting:</b> <b>Dear Mr Khan,</b></p>" +
        "<p><b>2. Chatty words out:</b> no slang, no short forms. Make the request polite and indirect.</p>" +
        "<p><b>3. Full sentences, tone and sign off:</b> \"nothing I can do\" sounds a bit grumpy, so soften it.</p>" +
        task("Dear Mr Khan,<br>I am writing to let you know that I will be a little late on Saturday, as the roads are very busy. I apologise for any inconvenience.<br>Kind regards, Jay") } } },

    Q("match", "Swap the words", null, [
      { q: "<b>Step 1 is done.</b> Step 2: match each chatty word to its dressed up version.",
        pairs: [["gonna", "going to"], ["ta", "thank you"], ["loads", "a lot"]],
        ez: { q: "Match each chatty word to its dressed up word.", hint: "Say them out loud." },
        hint: "Say them out loud. Which ones mean the same?",
        why: "Same meaning, dressed up.",
        medium: { pairs: [["gonna", "going to"], ["ta", "thank you"], ["loads", "a lot"], ["can't", "cannot"], ["yeah", "yes"]] },
        spicy: { pairs: [["gonna", "going to"], ["loads", "a great deal"], ["get", "receive"], ["ask for", "request"], ["say sorry", "apologise"], ["help", "assistance"]] } },
      { q: "<b>Step 1 is done.</b> Step 2: match each chatty word to its dressed up version.",
        pairs: [["wanna", "want to"], ["soz", "sorry"], ["yeah", "yes"]],
        ez: { q: "Match each chatty word to its dressed up word.", hint: "Say them out loud." },
        hint: "Say them out loud. Which ones mean the same?",
        why: "Same meaning, dressed up.",
        medium: { pairs: [["wanna", "want to"], ["soz", "sorry"], ["yeah", "yes"], ["I'm", "I am"], ["kids", "children"]] },
        spicy: { pairs: [["wanna", "would like to"], ["find out", "discover"], ["tell", "inform"], ["need", "require"], ["start", "commence"], ["enough", "sufficient"]] } },
      { q: "<b>Step 1 is done.</b> Step 2: match each chatty word to its dressed up version.",
        pairs: [["gotta", "have to"], ["cheers", "thank you"], ["mate", "Mr Khan"]],
        ez: { q: "Match each chatty word to its dressed up word.", hint: "Say them out loud." },
        hint: "Say them out loud. Which ones mean the same?",
        why: "Same meaning, dressed up.",
        medium: { pairs: [["gotta", "have to"], ["cheers", "thank you"], ["don't", "do not"], ["telly", "television"], ["loads of", "many"]] },
        spicy: { pairs: [["gotta", "must"], ["check out", "examine"], ["about", "approximately"], ["but", "however"], ["buy", "purchase"], ["so", "therefore"]] } }
    ]),

    Q("mc", "Swap the words", { explain: true }, [
      { q: "<b>Steps 1 and 2.</b> Which is the best dressed up version of this, for [[boss]]?" + task("Can't come Monday, soz."),
        o: ["I am sorry, but I cannot come on Monday.", "Can't come Monday, soz.", "Soz mate, Monday's a no."],
        ez: { q: "Dress this up for [[boss]]. Which is best?" + task("Can't come Monday, soz."), s: ["That is the chatty one.", "Even more chatty."], why: "Can't becomes cannot. Soz becomes sorry." },
        s: ["That is the chatty one, unchanged.", "Even more chatty than before."],
        hint: "Full words, polite.",
        why: "Can't becomes cannot, soz becomes I am sorry, and it is a full sentence.",
        spicy: { o: ["I apologise, but I will be unable to attend on Monday.", "I am sorry but I can't come Monday.", "Monday is not possible. Soz."],
          s: ["Better, but can't is still a short form and on is missing.", "Soz is still chatty, and the first sentence sounds blunt."] } },
      { q: "<b>Steps 1 and 2.</b> Which is the best dressed up version of this, for [[boss]]?" + task("Ta for the job, gonna be well good!"),
        o: ["Thank you for the job. I am looking forward to it.", "Ta for the job, gonna be well good!", "Ta. Gonna be good."],
        ez: { q: "Dress this up for [[boss]]. Which is best?" + task("Ta for the job, gonna be well good!"), s: ["That is the chatty one.", "Shorter, but still chatty."], why: "Ta becomes thank you." },
        s: ["That is the chatty one, unchanged.", "Shorter, but still chatty."],
        hint: "Swap ta, gonna and well good.",
        why: "Ta becomes thank you, gonna be well good becomes I am looking forward to it.",
        spicy: { o: ["Thank you for offering me the job. I am very much looking forward to starting.", "Thanks for the job, I'm really looking forward to it!", "I accept the job. It will be good."],
          s: ["Friendly, but thanks, I'm and the exclamation mark keep it informal.", "Formal, but cold. It sounds like a robot."] } },
      { q: "<b>Steps 1 and 2.</b> Which is the best dressed up version of this, for [[boss]]?" + task("Wanna ask summat about Friday."),
        o: ["Could I ask you something about Friday?", "Wanna ask summat about Friday.", "Oi, Friday, question."],
        ez: { q: "Dress this up for [[boss]]. Which is best?" + task("Wanna ask summat about Friday."), s: ["That is the chatty one.", "Even more chatty."], why: "It is a polite question now." },
        s: ["That is the chatty one, unchanged.", "Even more chatty, and a bit rude."],
        hint: "Make it a polite question.",
        why: "Wanna ask summat becomes Could I ask you something: polite and full.",
        spicy: { o: ["I would be grateful if I could ask you a question about Friday.", "Can I ask about Friday?", "Question about Friday."],
          s: ["Polite, but casual. Fine for a teacher you know, not for a new boss.", "Too blunt: no greeting words at all."] } }
    ]),

    Q("text", "Swap the words", null, [
      { q: "<b>All three steps, on your own.</b> Dress this up for [[boss]]:" + task("Hiya, cheers for the job!"),
        need: [["dear", "hello", "good morning", "good afternoon"], ["thank you", "grateful", "appreciate"]],
        model: "Dear Mr Khan, thank you for the job.",
        slips: [[["hiya", "cheers", "ta ", "thanks loads", "soz"], "That still has a chatty word in it. Try swapping it for the dressed up version."]],
        ez: { q: "Dress this up for [[boss]]:" + task("Hiya, cheers for the job!"), slips: [[["hiya", "cheers", "ta ", "thanks loads", "soz"], "There is still a chatty word. Swap it."]], hint: "Swap Hiya and cheers.", why: "Like this: <b>Dear Mr Khan, thank you for the job.</b>" },
        hint: "Swap Hiya for a dressed up greeting, and cheers for thank you.",
        why: "Something like <b>Dear Mr Khan, thank you for the job.</b>",
        spicy: { q: "<b>All three steps, on your own.</b> Dress this up for [[boss]], as one or two full sentences:" + task("Hiya, cheers for the job, can't wait!"),
          need: [["dear", "hello", "good morning", "good afternoon"], ["thank you", "grateful", "appreciate"], ["look forward", "looking forward", "excited", "pleased", "delighted"]],
          model: "Dear Mr Khan, thank you for offering me the job. I am looking forward to starting.",
          hint: "Greeting, thank you, and a polite way to say can't wait.",
          why: "For example: <b>Dear Mr Khan, thank you for offering me the job. I am looking forward to starting.</b>" } },
      { q: "<b>All three steps, on your own.</b> Dress this up for [[boss]]:" + task("Soz, gonna be late."),
        need: [["sorry", "apologise", "apologies"], ["going to", "will be", "late"]],
        model: "I am sorry, but I am going to be late.",
        slips: [[["soz", "gonna", "wanna"], "That still has a chatty word in it."]],
        ez: { q: "Dress this up for [[boss]]:" + task("Soz, gonna be late."), slips: [[["soz", "gonna", "wanna"], "There is still a chatty word."]], why: "Like this: <b>I am sorry, but I am going to be late.</b>" },
        hint: "Swap soz and gonna.",
        why: "Something like <b>I am sorry, but I am going to be late.</b>",
        spicy: { q: "<b>All three steps, on your own.</b> Dress this up for [[boss]], as one or two full sentences:" + task("Soz, gonna be late, bus is rubbish."),
          need: [["sorry", "apologise", "apologies"], ["late", "delayed"], ["bus"]],
          model: "I apologise, but I will be late because the bus is delayed.",
          slips: [[["soz", "gonna", "rubbish"], "That still has a chatty word in it."]],
          hint: "Say sorry, say you will be late, and say why without the grumpy word.",
          why: "For example: <b>I apologise, but I will be late, as the bus is delayed.</b>" } },
      { q: "<b>All three steps, on your own.</b> Dress this up for [[boss]]:" + task("Can I have Friday off? Ta."),
        need: [["could", "may", "would", "please", "possible"], ["friday"]],
        model: "Please could I have Friday off? Thank you.",
        slips: [[["ta", "cheers", "soz"], "That still has a chatty word in it."]],
        ez: { q: "Dress this up for [[boss]]:" + task("Can I have Friday off? Ta."), slips: [[["ta", "cheers", "soz"], "There is still a chatty word."]], hint: "Ask politely. Swap ta.", why: "Like this: <b>Please could I have Friday off? Thank you.</b>" },
        hint: "Make the question polite, and swap ta.",
        why: "Something like <b>Please could I have Friday off? Thank you.</b>",
        spicy: { q: "<b>All three steps, on your own.</b> Dress this up for [[boss]], as one or two full sentences:" + task("Can I have Friday off? Got a thing. Ta."),
          need: [["could", "may", "would", "grateful", "possible"], ["friday"], ["thank", "grateful", "appreciate"]],
          model: "I would be grateful if I could have Friday off, as I have an appointment. Thank you.",
          slips: [[["ta", "cheers", "got a thing"], "That still has a chatty bit in it."]],
          hint: "A polite request, a polite reason, and thank you.",
          why: "For example: <b>I would be grateful if I could have Friday off, as I have an appointment. Thank you.</b>" } }
    ]),

    /* ---------- chunk 4: adverts ---------- */
    { type: "learn", topic: "Adverts", title: "How adverts talk to you",
      fig: ADVERT,
      ez: { title: "Advert tricks", html: "<p>An <b>advert</b> wants you to buy.</p><p>A question. Exciting words. A deal. Act now!</p>" },
      html: "<p>An <b>advert</b> wants you to buy something or do something. So it uses tricks.</p>" +
        "<p>It asks a <b>question</b> to hook you. It talks to <b>you</b>. It uses <b>exciting words</b> like amazing. It gives you a <b>deal</b>. It tells you to <b>act now</b>.</p>",
      lv: {
        medium: { html: "<p>Adverts are written to <b>persuade</b>. Look for:</p>" +
          "<p>a <b>question hook</b> (Bored on Saturday?), <b>you</b> (You will love it), <b>exciting adjectives</b> (amazing, brilliant), a <b>deal</b> (only 2 pounds), <b>act now</b> words (Book now! Limited places!), and short punchy sentences.</p>" +
          "<p>Adverts are usually informal, so they feel like a friend talking to you.</p>" },
        spicy: { html: "<p>Persuasive writing has a toolkit. Common ones:</p>" +
          "<p><b>Rhetorical questions</b> (Bored on Saturday?), <b>direct address</b> (you), <b>emotive language</b> (unforgettable, heartwarming), <b>the rule of three</b> (fun, fresh and fast), <b>urgency</b> (only 5 left), <b>flattery</b> (you deserve it) and <b>social proof</b> (thousands of happy customers).</p>" +
          "<p>Knowing the tricks helps you use them, and spot when they are being used on you.</p>" } } },

    Q("multi", "Adverts", null, [
      { q: "Pick <b>all</b> the advert tricks in this one." + task("Bored this weekend? Try our amazing [[ad]]! Book now!"),
        options: ["A question to hook you", "Exciting words like amazing", "Telling you to act now", "Long formal sentences"],
        answers: [0, 1, 2],
        slips: { any: "Three tricks are there. Adverts keep sentences short and chatty." },
        ez: { q: "Pick <b>all</b> the tricks." + task("Bored this weekend? Try our amazing [[ad]]! Book now!"), slips: { any: "3 tricks. Adverts keep it short." }, hint: "Look at the start, middle and end.", why: "A question, an exciting word, act now." },
        hint: "Look at the start, the middle and the end.",
        why: "A question, an exciting word, and act now. Adverts keep it short.",
        medium: { options: ["A question to hook you", "Exciting words like amazing", "Telling you to act now", "Talking to you", "Long formal sentences", "Dear Sir or Madam"], answers: [0, 1, 2, 3],
          slips: { any: "Four tricks. Adverts do not use long formal sentences or letter greetings." } },
        spicy: { q: "Pick <b>all</b> the persuasive techniques in this one." + task("Bored this weekend? Our unforgettable [[ad]] are fun, friendly and fearless. Thousands of happy customers can't be wrong. Only 5 places left!"),
          options: ["Rhetorical question", "Emotive language", "Rule of three", "Social proof", "Urgency", "Formal greeting", "Step by step instructions"], answers: [0, 1, 2, 3, 4],
          slips: { any: "Five techniques. No greeting, and no steps." } } },
      { q: "Pick <b>all</b> the advert tricks in this one." + task("Want to have the best summer ever? Our [[ad]] are brilliant. Only 5 pounds!"),
        options: ["A question to hook you", "Exciting words like brilliant", "A deal", "Numbered steps"],
        answers: [0, 1, 2],
        slips: { any: "Three tricks are there. Numbered steps are for instructions." },
        ez: { q: "Pick <b>all</b> the tricks." + task("Want to have the best summer ever? Our [[ad]] are brilliant. Only 5 pounds!"), slips: { any: "3 tricks. Steps are for instructions." }, why: "A question, brilliant, and a deal." },
        hint: "Question, exciting word, deal.",
        why: "A question, brilliant, and a cheap price.",
        medium: { options: ["A question to hook you", "Exciting words like brilliant", "A deal", "Talking to you", "Numbered steps", "Yours sincerely"], answers: [0, 1, 2, 3],
          slips: { any: "Four tricks. No steps and no letter sign off." } },
        spicy: { q: "Pick <b>all</b> the persuasive techniques in this one." + task("You deserve the best summer ever. Our [[ad]] are exciting, expert and excellent value. Don't miss out!"),
          options: ["Flattery", "Direct address", "Rule of three", "Urgency", "Rhetorical question", "Social proof", "Formal sign off"], answers: [0, 1, 2, 3],
          slips: { any: "Four techniques. There is no question, no mention of other customers and no sign off." } } },
      { q: "Pick <b>all</b> the advert tricks in this one." + task("Hey you! Love birds? Join Jay's AMAZING bird walk today!"),
        options: ["Talking to you", "A question to hook you", "Exciting words like amazing", "A formal greeting"],
        answers: [0, 1, 2],
        slips: { any: "Three tricks. Hey you is not a formal greeting!" },
        ez: { q: "Pick <b>all</b> the tricks." + task("Hey you! Love birds? Join Jay's AMAZING bird walk today!"), slips: { any: "3 tricks. Hey you is not formal!" }, why: "Hey you, a question, and AMAZING." },
        hint: "Who is it talking to?",
        why: "Hey you, a question, and AMAZING. Jay's walks are, in fairness.",
        medium: { options: ["Talking to you", "A question to hook you", "Exciting words like amazing", "Telling you to act now", "A formal greeting", "Numbered steps"], answers: [0, 1, 2, 3],
          slips: { any: "Four tricks. Hey you is not formal, and there are no steps." } },
        spicy: { q: "Pick <b>all</b> the persuasive techniques in this one." + task("Love birds? Join hundreds of happy walkers on Jay's unforgettable bird walk. Spaces are going fast!"),
          options: ["Rhetorical question", "Social proof", "Emotive language", "Urgency", "Flattery", "Rule of three", "Formal greeting"], answers: [0, 1, 2, 3],
          slips: { any: "Four techniques. No flattery, no group of three, no greeting." } } }
    ]),

    Q("mc", "Adverts", null, [
      { q: "Which is the best advert line for [[ad]]?",
        o: ["Try [[ad]] today. You will love them!", "[[Ad]] are an activity.", "Dear Sir or Madam, here is information about [[ad]]."],
        s: ["True, but it does not make anyone want to try them.", "That is a formal letter, not an advert."],
        ez: { s: ["True, but not exciting.", "That is a letter, not an advert."], why: "It talks to you. It sounds fun." },
        hint: "Which one makes you want to try?",
        why: "It talks to you and makes it sound fun.",
        spicy: { o: ["Ready for something new? Book [[ad]] today: places are going fast!", "[[Ad]] are available on weekdays.", "Please contact us if you require [[ad]]."],
          s: ["Information only. No reason to act.", "Polite, but it waits for the reader to come to it. No hook, no urgency."] } },
      { q: "Which is the best advert line for a cafe?",
        o: ["Fancy a treat? Our hot chocolate is the best in town!", "The cafe sells drinks.", "Hot chocolate is made with milk."],
        s: ["True, but nobody will rush in.", "A fact, not a reason to come."],
        ez: { q: "Which is the best advert for a cafe?", why: "A question hook, then a big claim." },
        hint: "Which one makes you want to go?",
        why: "A question hook, and an exciting claim.",
        spicy: { o: ["Cold outside? Warm up with the creamiest hot chocolate in town. You deserve it.", "Our cafe is open from 9 until 5.", "We would like to inform you that we sell drinks."],
          s: ["Useful information, but no persuasion.", "Far too formal, and still no reason to come."] } },
      { q: "Which is the best advert line for a dog walking service?",
        o: ["Busy day? We will walk your dog and make them happy!", "We walk dogs.", "Dogs need walks."],
        s: ["True, but flat.", "A fact, not an advert."],
        ez: { q: "Which is the best advert for dog walking?", hint: "Which one talks to the owner?", why: "A question, and a happy dog. Bonnie approves." },
        hint: "Which one speaks to the owner?",
        why: "It hooks the reader with a question and promises a happy dog. Bonnie approves.",
        spicy: { o: ["Stuck at work? Your dog deserves a happy, healthy, adventure filled walk. Book today!", "Dog walking: 10 pounds per hour.", "We are a company that offers dog walking."],
          s: ["A price, but nothing to make an owner want it.", "Flat description, no hook."] } }
    ]),

    { type: "write", topic: "Adverts",
      q: "Only if you fancy it: write the same message twice. Once to a friend, once to [[boss]]. For example, saying you will be late, or saying thank you.",
      starters: ["To my friend:", "To the boss: Dear", "Thank you for", "Soz, I'm"],
      checklist: ["The friend one is chatty", "The boss one is polite, with full words"],
      minWords: 15,
      ez: { q: "If you like: write one message twice. To a friend, then to [[boss]]." },
      lv: { medium: { q: "Only if you fancy it: write a short advert for [[ad]], then a polite message to [[boss]] asking to be a [[job]].", minWords: 35,
          checklist: ["The advert has a question hook and talks to you", "The advert tells you to act now", "The message is polite, with full words and a sign off"] },
        spicy: { q: "Only if you fancy it: write a short advert for [[ad]] aimed at teenagers, then rewrite it for their parents. Change the words, not just the facts.", minWords: 60,
          checklist: ["Two different audiences, two different tones", "At least three persuasive techniques", "The parent version is more formal"] } } }
  ],

  realWorld: {
    title: "Where you would use this",
    html: "<p>Everyone switches. You talk one way to your mates, another to a shop assistant, another in a job interview. Writing is the same: a text, an email to school, a job application, an advert for a car boot sale. Picking the right words gets you taken seriously.</p>" +
      "<p>For our big question, if we could time travel, should we? Imagine landing in 1850 and saying \"Hiya, that's well good!\". Nobody would understand you. You would need your most dressed up words of all.</p>",
    fig: '<svg viewBox="0 0 440 150" role="img" aria-label="Jay coming out of the time portal saying Good day to you">' + A.portal(74, 76, 54) +
      A.jay(206, 54, 0.8, "hmm") + A.bubble(260, 12, 164, 52, "Hiya! I mean...\ngood day to you.", 270) + '</svg>'
  },

  ez: {
    realWorld: { title: "Where you use this", html: "<p>You talk one way to mates. Another way at a job interview.</p><p>Time travel to 1850? \"Hiya!\" would confuse people.</p>" },
    make: { intro: "One message, dressed down and dressed up." }
  },

  make: {
    title: "Make a two ways card",
    intro: "The same message, dressed down and dressed up. Keep it, put it up, or send it to Jay.",
    fields: [
      { id: "friend", label: "To a friend", ph: "Can't wait for Saturday!", max: 44 },
      { id: "boss", label: "To a boss", ph: "I am looking forward to Saturday.", max: 44 },
      { id: "name", label: "By", ph: "B5", max: 20 }
    ],
    svg: function(v){
      function side(x, col, title, txt, icon){
        var ls = wrap(txt, 16, 3);
        return '<rect x="' + x + '" y="40" width="262" height="300" rx="18" fill="' + col + '" stroke="#141a33" stroke-width="3"/>' +
          T(x + 131, 80, title, 22, { a: "middle", b: 1 }) + icon +
          ls.map(function(l, k){ return T(x + 131, 210 + k * 32, esc(l), 20, { a: "middle", b: 1 }); }).join("");
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fffdf6"/>' +
        side(26, "#fff1e0", "Dressed down", v.friend, shoe(157, 140, "#ff8a5c")) +
        side(312, "#e8f0ff", "Dressed up", v.boss, tie(443, 140)) +
        T(300, 378, "By " + esc(wrap(v.name, 20, 1)[0] || ""), 16, { a: "middle", c: "#5b6180" }) +
        '</svg>';
    }
  }
};
})();
