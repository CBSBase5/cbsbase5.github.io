/* Base 5 Autumn 2 activity: Adventure day.
   Physical World. Getting ready for, having a go at, and looking back on
   an adventure activity. ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }

/* ---------- pictures ---------- */
var ICONS = {
  wall: '<rect x="-30" y="-36" width="60" height="72" rx="4" fill="#c99a63" stroke="#141a33" stroke-width="2.5"/>' +
    '<circle cx="-14" cy="22" r="5" fill="#ff5d8f"/><circle cx="10" cy="10" r="5" fill="#ffd23f"/><circle cx="-8" cy="-4" r="5" fill="#22b8e6"/><circle cx="14" cy="-18" r="5" fill="#19c39a"/><circle cx="-12" cy="-26" r="5" fill="#8a5cf6"/>' +
    '<path d="M0 -36v72" stroke="#e04848" stroke-width="2.5" stroke-dasharray="5 4"/>',
  ropes: '<path d="M-36 30v-60M36 30v-60" stroke="#7a5532" stroke-width="6"/><path d="M-36 -4h72" stroke="#141a33" stroke-width="3"/><path d="M-36 -22h72" stroke="#e04848" stroke-width="2.5"/>' +
    '<path d="M-24 -4v10M-12 -4v10M0 -4v10M12 -4v10M24 -4v10" stroke="#141a33" stroke-width="2"/><path d="M-28 6h56" stroke="#a0784a" stroke-width="5"/>',
  kayak: '<path d="M-40 20q40 -60 80 0" fill="#5bb8e8" fill-opacity=".35"/><path d="M-40 12q40 20 80 0q-40 -10 -80 0z" fill="#ff8a3d" stroke="#141a33" stroke-width="2.5"/>' +
    '<path d="M-26 -20l52 30" stroke="#141a33" stroke-width="3"/><ellipse cx="-26" cy="-20" rx="5" ry="9" fill="#ffd23f" stroke="#141a33" stroke-width="2" transform="rotate(-60 -26 -20)"/>' +
    '<path d="M-44 28q11 -6 22 0t22 0t22 0t22 0" fill="none" stroke="#3a8fd6" stroke-width="3"/>',
  walk: '<path d="M-40 30l26 -46 16 22 12 -18 28 42z" fill="#cfe0a8" stroke="#7a5532" stroke-width="2.5"/>' +
    '<path d="M-30 30q20 -20 30 -8t28 -10" fill="none" stroke="#e04848" stroke-width="2.5" stroke-dasharray="5 4"/>' +
    '<path d="M-14 -16v-16l12 5 -12 5" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>'
};
function icons(list){
  return '<svg viewBox="0 0 520 190" role="img" aria-label="Adventure activities: ' + list.map(function(x){ return x[1]; }).join(", ") + '">' +
    '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
    list.map(function(it, k){
      var x = 70 + k * 127;
      return '<g transform="translate(' + x + ' 80)"><circle r="54" fill="' + it[2] + '" fill-opacity=".3" stroke="#141a33" stroke-width="2.5"/>' + ICONS[it[0]] + '</g>' +
        T(x, 166, it[1], 15, { b: 1, a: "middle" });
    }).join("") + '</svg>';
}
var ACTS = icons([["wall", "Climbing wall", "#ffd23f"], ["ropes", "High ropes", "#19c39a"], ["kayak", "Kayaking", "#22b8e6"], ["walk", "Hill walk", "#ff5d8f"]]);

var KIT = '<svg viewBox="0 0 520 230" role="img" aria-label="Safety kit: a helmet, a harness, a clip called a carabiner, and grippy shoes">' +
  '<rect width="520" height="230" rx="16" fill="#f4f1ea"/>' +
  /* helmet */
  '<g transform="translate(70 96)"><path d="M-40 10a40 36 0 0 1 80 0z" fill="#e04848" stroke="#141a33" stroke-width="3"/><path d="M-44 10h88" stroke="#141a33" stroke-width="5" stroke-linecap="round"/>' +
  '<path d="M-28 12q28 30 56 0" fill="none" stroke="#141a33" stroke-width="2.5"/><path d="M-10 -20h20" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>' + T(70, 170, "Helmet", 15, { b: 1, a: "middle" }) +
  /* harness */
  '<g transform="translate(195 96)"><path d="M-36 -20q36 14 72 0v12q-36 14 -72 0z" fill="#3a8fd6" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M-24 -6q-10 30 4 46M24 -6q10 30 -4 46" fill="none" stroke="#3a8fd6" stroke-width="9"/><path d="M-24 -6q-10 30 4 46M24 -6q10 30 -4 46" fill="none" stroke="#141a33" stroke-width="1.5"/>' +
  '<rect x="-8" y="-14" width="16" height="12" rx="2" fill="#c8ccd2" stroke="#141a33" stroke-width="2"/><path d="M0 0v18" stroke="#141a33" stroke-width="5"/></g>' + T(195, 170, "Harness", 15, { b: 1, a: "middle" }) +
  /* carabiner */
  '<g transform="translate(320 96)"><path d="M-14 -34h22a14 14 0 0 1 14 14v40a14 14 0 0 1 -14 14h-22a14 14 0 0 1 -14 -14v-40a14 14 0 0 1 14 -14z" fill="none" stroke="#8a5cf6" stroke-width="7"/>' +
  '<path d="M22 -10v18" stroke="#f4f1ea" stroke-width="9"/><path d="M22 -12l-6 22" stroke="#141a33" stroke-width="4"/></g>' + T(320, 170, "Clip", 15, { b: 1, a: "middle" }) + T(320, 190, "(carabiner)", 13, { a: "middle", c: "#5b6180" }) +
  /* shoes */
  '<g transform="translate(445 100)"><path d="M-40 10v-22q0 -8 8 -8h18q4 14 22 16l22 6q10 4 10 12v6h-80z" fill="#19c39a" stroke="#141a33" stroke-width="2.5"/>' +
  '<path d="M-40 20h80" stroke="#141a33" stroke-width="5"/><path d="M-34 26l6 -6M-22 26l6 -6M-10 26l6 -6M2 26l6 -6M14 26l6 -6M26 26l6 -6" stroke="#141a33" stroke-width="2"/></g>' + T(445, 170, "Grippy shoes", 15, { b: 1, a: "middle" }) +
  A2ART.egg(A2ART.bird(492, 30, 0.6, "#ffd23f"), "A bird on the high ropes. It does not need a harness. Jay is very jealous.") +
  '</svg>';

/* comfort, stretch, too much */
function zones(dot){
  return '<svg viewBox="0 0 520 240" role="img" aria-label="Three zones: comfort in the middle, stretch around it, too much on the outside">' +
    '<rect width="520" height="240" rx="16" fill="#f4f1ea"/>' +
    '<ellipse cx="190" cy="120" rx="170" ry="104" fill="#ff8a8a" fill-opacity=".55" stroke="#141a33" stroke-width="2.5"/>' +
    '<ellipse cx="190" cy="120" rx="118" ry="72" fill="#ffd23f" fill-opacity=".8" stroke="#141a33" stroke-width="2.5"/>' +
    '<ellipse cx="190" cy="120" rx="58" ry="36" fill="#19c39a" fill-opacity=".9" stroke="#141a33" stroke-width="2.5"/>' +
    T(190, 126, "Comfort", 15, { b: 1, a: "middle" }) + T(190, 72, "Stretch", 15, { b: 1, a: "middle" }) + T(190, 36, "Too much", 15, { b: 1, a: "middle" }) +
    (dot ? '<circle cx="268" cy="132" r="9" fill="#141a33"/>' : "") +
    T(375, 82, "Comfort: easy, safe.", 13) + T(375, 112, "Stretch: a bit wobbly,", 13) + T(375, 130, "where you learn.", 13) +
    T(375, 160, "Too much: switch off,", 13) + T(375, 178, "step back. That is OK.", 13) +
    '</svg>';
}

/* box breathing */
var BOX = '<svg viewBox="0 0 520 230" role="img" aria-label="Box breathing: in for 4, hold for 4, out for 4, hold for 4">' +
  '<rect width="520" height="230" rx="16" fill="#e8f4fb"/>' +
  '<rect x="100" y="40" width="150" height="150" rx="10" fill="#fff" stroke="#22b8e6" stroke-width="6"/>' +
  T(175, 30, "In 4", 15, { b: 1, a: "middle" }) + T(262, 120, "Hold 4", 15, { b: 1 }) + T(175, 216, "Out 4", 15, { b: 1, a: "middle" }) + T(88, 120, "Hold 4", 15, { b: 1, a: "end" }) +
  '<circle cx="100" cy="40" r="9" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M168 32l14 8 -14 8z" fill="#141a33"/><path d="M242 108l8 14 8 -14z" fill="#141a33"/><path d="M182 182l-14 8 14 8z" fill="#141a33"/><path d="M92 122l8 -14 8 14z" fill="#141a33"/>' +
  T(175, 120, "Follow the", 13, { a: "middle", c: "#5b6180" }) + T(175, 138, "box round", 13, { a: "middle", c: "#5b6180" }) +
  A2ART.bonnie(430, 170, 1, "sit") +
  A2ART.bubble(340, 18, 160, 50, "Slow breaths.\nBonnie approves.", 400) +
  '</svg>';

/* a risk grid for the spicy level */
function grid(hl){
  var s = '<svg viewBox="0 0 520 260" role="img" aria-label="A risk grid: how likely times how bad">' + '<rect width="520" height="260" rx="16" fill="#f4f1ea"/>';
  var cols = ["#bfe8c9", "#ffe58a", "#ffb37a", "#ffe58a", "#ffb37a", "#ff8a8a", "#ffb37a", "#ff8a8a", "#ff6b6b"];
  for(var r = 0; r < 3; r++) for(var c = 0; c < 3; c++){
    var like = c + 1, bad = 3 - r, v = like * bad, x = 150 + c * 80, y = 30 + r * 60;
    s += '<rect x="' + x + '" y="' + y + '" width="80" height="60" fill="' + cols[(bad - 1) * 3 + c] + '" stroke="#141a33" stroke-width="2"/>' +
      (hl && hl[0] === like && hl[1] === bad ? '<rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="72" height="52" fill="none" stroke="#141a33" stroke-width="4" stroke-dasharray="6 4"/>' : "") +
      T(x + 40, y + 37, String(v), 18, { b: 1, a: "middle" });
  }
  s += T(270, 246, "How likely  (1 to 3)", 14, { b: 1, a: "middle" }) +
    T(180, 222, "1", 13, { a: "middle" }) + T(260, 222, "2", 13, { a: "middle" }) + T(340, 222, "3", 13, { a: "middle" }) +
    T(136, 66, "3", 13, { a: "end" }) + T(136, 126, "2", 13, { a: "end" }) + T(136, 186, "1", 13, { a: "end" }) +
    T(30, 110, "How bad", 14, { b: 1 }) + T(30, 128, "(1 to 3)", 13) +
    T(410, 70, "Score =", 14, { b: 1 }) + T(410, 90, "likely x bad", 14) + T(410, 130, "Bigger score:", 13) + T(410, 148, "more care,", 13) + T(410, 166, "or change it.", 13) + '</svg>';
  return s;
}

/* reflect: what went well, even better if, next time */
var REFLECT = '<svg viewBox="0 0 520 190" role="img" aria-label="Three reflection questions: what went well, what was tricky, what next">' +
  '<rect width="520" height="190" rx="16" fill="#f4f1ea"/>' +
  [["What went", "well?", "#19c39a"], ["What was", "tricky?", "#ffd23f"], ["What could", "I try next?", "#22b8e6"]].map(function(c, k){
    var x = 20 + k * 166;
    return '<rect x="' + x + '" y="30" width="148" height="120" rx="14" fill="' + c[2] + '" fill-opacity=".35" stroke="#141a33" stroke-width="2.5"/>' +
      T(x + 74, 84, c[0], 15, { b: 1, a: "middle" }) + T(x + 74, 106, c[1], 15, { b: 1, a: "middle" });
  }).join("") + T(260, 176, "Looking back is how you get better at anything.", 13, { a: "middle", c: "#5b6180" }) + '</svg>';

/* ---------- widgets ---------- */
function zoneWidget(el, api){
  var d = api.data || {};
  var rows = [["before", "Before I tried it"], ["after", "After I tried it (fill in later, if you like)"]];
  el.innerHTML = '<div class="zw"></div><p class="tiny">Tap a zone on each row. No right answer here: it is just for you, and for Jay if you send it.</p>';
  var host = el.querySelector(".zw");
  var Z = [["comfort", "Comfort", "#19c39a"], ["stretch", "Stretch", "#ffd23f"], ["much", "Too much", "#ff8a8a"]];
  function draw(){
    host.innerHTML = rows.map(function(r){
      return '<p style="font-weight:700;margin:10px 0 6px">' + r[1] + '</p><div style="display:flex;gap:8px;flex-wrap:wrap">' +
        Z.map(function(z){
          var on = d[r[0]] === z[0];
          return '<button type="button" data-r="' + r[0] + '" data-z="' + z[0] + '" aria-pressed="' + on + '" style="font:inherit;cursor:pointer;padding:10px 16px;border-radius:12px;border:3px solid ' + (on ? "#141a33" : "#d9d8e6") + ';background:' + z[2] + (on ? "" : "55") + ';font-weight:' + (on ? 700 : 400) + '">' + z[1] + '</button>';
        }).join("") + '</div>';
    }).join("");
  }
  host.addEventListener("click", function(e){
    var b = e.target && e.target.closest ? e.target.closest("button[data-z]") : null;
    if(!b) return;
    d[b.getAttribute("data-r")] = b.getAttribute("data-z");
    try{ api.save(); }catch(err){}
    draw();
    api.done("done");
  });
  draw();
}

var CHALLENGE = ["Find out what the activity is and where", "Ask what to wear and bring", "Listen to the safety talk", "Let the instructor check your kit", "Have a go, as far as feels right", "Notice one thing that went well", "Tell Jay how it went, if you like"];
function checkWidget(el, api){
  var d = api.data || {};
  if(!Array.isArray(d.ticks)) d.ticks = [];
  el.innerHTML = '<div class="a2task"><h4>Adventure day challenge</h4><p>For the day itself, away from the screen. Tick things off whenever you like. Your ticks save here and can go to Jay.</p><div class="xlist"></div></div>';
  var list = el.querySelector(".xlist");
  CHALLENGE.forEach(function(t, k){
    var lab = document.createElement("label");
    lab.style.cssText = "display:flex;gap:10px;align-items:center;margin:8px 0;font-size:1rem;cursor:pointer";
    var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!d.ticks[k];
    cb.style.cssText = "width:22px;height:22px";
    cb.onchange = function(){ d.ticks[k] = cb.checked; try{ api.save(); }catch(err){} api.done("done"); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    list.appendChild(lab);
  });
}

(window.A2PACKS = window.A2PACKS || {})["adventure-day"] = {
  a2: true,
  id: "a2-adventure-day",
  title: "Adventure day",
  subject: "Physical World",
  bodyClass: "subj-home subj-pillar",
  mins: 20,
  line: "Get ready for an adventure activity, have a go your way, then look back on it.",
  blurb: "Getting ready for an adventure activity like a climbing wall, high ropes or a hill walk. Four short chunks: what it is, the kit and safety talk, having a go your way, and looking back. You make an adventure badge at the end.",
  note: "Getting ready for an adventure activity, and looking back on it after. Four five minute chunks and an adventure badge to make, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Foothills", line: "Foothills: what to wear, who to listen to, and small steps." },
    { id: "medium", name: "Treetops", line: "Treetops: why each bit of kit matters, and the stretch zone." },
    { id: "spicy", name: "Sky high", line: "Sky high: weighing up risks with a risk grid, and helping others." }
  ],
  themes: {
    time: { name: "Time travel", w: { centre: "the Time Rift adventure centre", top: "the portal bell at the top", crew: "your time crew" } },
    football: { name: "Football", w: { centre: "the adventure centre by the stadium", top: "the team flag at the top", crew: "your squad" } },
    horror: { name: "Horror", w: { centre: "the old quarry adventure centre", top: "the creaky bell at the top", crew: "your night shift crew" } },
    fishing: { name: "Fishing", w: { centre: "the lakeside adventure centre", top: "the buzzer at the top", crew: "your fishing buddies" } },
    music: { name: "Music", w: { centre: "the adventure centre with the outdoor stage", top: "the spotlight at the top", crew: "your cast" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: ACTS,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "What is an adventure activity?", title: "A bit of challenge, done safely",
      fig: ACTS,
      html: "<p>An adventure activity is something active with <b>a bit of challenge</b>, often outdoors or up high, done with an <b>instructor</b> who keeps it safe.</p>" +
        "<p>Climbing walls, high ropes, kayaking and hill walks are all adventure activities. Today, picture a trip to [[centre]] with [[crew]].</p>" +
        "<p>The adventure is the challenge. The safety is the instructor's job, and the kit's job.</p>",
      lv: { spicy: { html: "<p>An adventure activity has <b>real challenge</b> and some <b>risk</b>, but the risk is <b>managed</b>: trained instructors, checked kit and clear rules.</p>" +
        "<p>That is the deal. You get the buzz of doing something hard, and the people running it work hard so the chance of getting hurt stays tiny.</p>" +
        "<p>Today, picture a trip to [[centre]] with [[crew]]: climbing wall, high ropes, kayaks and a hill walk.</p>" } } },

    { type: "mc", topic: "What is an adventure activity?",
      q: "Which of these is an adventure activity?",
      options: ["A climbing wall with an instructor", "Watching a film", "Doing a jigsaw"],
      answer: 0,
      slips: { 1: "Films are great, but you sit still. An adventure activity is active, with a bit of challenge.", 2: "A jigsaw is a challenge for your brain, but not an active one." },
      hint: "Which one gets you moving, with a bit of challenge?",
      why: "A climbing wall is active, challenging, and an instructor keeps it safe.",
      lv: { spicy: { q: "What makes something an adventure activity, rather than just exercise?",
        options: ["Challenge and some managed risk, with trained people and kit", "It has to be dangerous", "It has to be a race", "It has to be done alone"],
        slips: { 1: "Not dangerous: the risk is managed so it stays small.", 2: "Lots of adventure activities are not races at all.", 3: "Most are done with a group and an instructor." },
        hint: "Think: challenge, risk, and who keeps it safe.",
        why: "Adventure means real challenge with managed risk: instructors, checked kit and rules." } } },

    { type: "sort", topic: "What is an adventure activity?",
      q: "Sort the activities. Where do they happen?",
      buckets: ["Up high", "On water", "On the ground"],
      cards: [["Climbing wall", 0], ["High ropes", 0], ["Kayaking", 1], ["Paddle boarding", 1], ["Hill walk", 2], ["Orienteering", 2]],
      hint: "Ropes and walls go up. Boats and boards go on water. Walks stay on the ground.",
      why: "Up high: climbing and ropes. On water: kayaks and boards. On the ground: walking and orienteering (finding your way with a map)." },

    { type: "mc", topic: "What is an adventure activity?",
      q: "At [[centre]], who is in charge of keeping everyone safe?",
      options: ["The instructor", "Whoever is fastest", "Nobody, you just go"],
      answer: 0,
      slips: { 1: "Speed has nothing to do with it. Someone trained runs the safety.", 2: "Adventure centres always have trained instructors in charge." },
      hint: "Who has been trained to run the activity?",
      why: "Instructors are trained and checked. Listening to them is the biggest safety tip of all." },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Kit and the safety talk", title: "Every bit of kit has a job",
      fig: KIT,
      html: "<p>A <b>helmet</b> protects your head. A <b>harness</b> holds you on the rope. A <b>clip</b> (called a carabiner) joins you to the rope or the safety line. <b>Grippy shoes</b> stop your feet slipping.</p>" +
        "<p>Before anything starts there is a <b>safety talk</b>. Then the instructor <b>checks your kit</b>. Only then do you clip on.</p>",
      lv: { mild: { html: "<p>You might wear a <b>helmet</b> for your head, and a <b>harness</b> that joins you to the rope.</p><p>First you listen to the safety talk. Then the instructor checks your kit. Then you have a go.</p>" },
        spicy: { html: "<p><b>Helmet</b>: protects your head from bumps and falling bits. <b>Harness</b>: spreads your weight safely when the rope holds you. <b>Clip</b> (carabiner): links you to the rope or line; it has a gate that locks. <b>Grippy shoes</b>: friction on the holds.</p>" +
          "<p>On high ropes, the golden rule is <b>always at least one clip on</b> the safety line. You move one clip at a time.</p>" +
          "<p>The order matters too: safety talk, kit on, kit checked by an instructor, then clip on.</p>" } } },

    { type: "match", topic: "Kit and the safety talk",
      q: "Match each bit of kit to its job.",
      pairs: [["Helmet", "Protects your head"], ["Harness", "Holds you on the rope"], ["Clip", "Joins you to the safety line"], ["Grippy shoes", "Stop your feet slipping"]],
      hint: "Think about where each one goes on your body.",
      why: "Head, middle, link, feet. Every bit of kit has one job." },

    { type: "order", topic: "Kit and the safety talk",
      q: "Put the start of the session in order.",
      items: ["Listen to the safety talk", "Put on the helmet and harness", "The instructor checks your kit", "Clip on to the rope", "Have a go"],
      hint: "You cannot check kit that is not on yet.",
      why: "Talk, kit on, kit checked, clip on, go. Checking before clipping on is the bit that keeps you safe." },

    { type: "mc", topic: "Kit and the safety talk",
      q: "On the high ropes, how many of your clips should be on the safety line?",
      fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A person on high ropes clipped to a safety line">' +
        '<rect width="420" height="150" rx="16" fill="#e8f4fb"/><path d="M20 40h380" stroke="#e04848" stroke-width="4"/><path d="M20 100h380" stroke="#a0784a" stroke-width="10"/>' +
        '<path d="M190 40l18 34M230 40l-18 34" stroke="#8a5cf6" stroke-width="3"/><circle cx="190" cy="44" r="7" fill="none" stroke="#8a5cf6" stroke-width="4"/><circle cx="230" cy="44" r="7" fill="none" stroke="#8a5cf6" stroke-width="4"/>' +
        '<circle cx="210" cy="70" r="12" fill="#f6d1b0" stroke="#141a33" stroke-width="2"/><path d="M210 82v12M198 94l12 -6 12 6" stroke="#141a33" stroke-width="4"/>' +
        T(30, 30, "Safety line", 13, { b: 1, c: "#e04848" }) + '</svg>',
      options: ["At least one, all the time", "None, once you are confident", "Only on the tricky bits"],
      answer: 0,
      slips: { 1: "Even experts stay clipped on. Confidence is great, the clip is still the rule.", 2: "The easy bits are high up too. The clip stays on everywhere." },
      hint: "What would happen if you slipped with no clip on?",
      why: "Always at least one clip on. You move one clip at a time, so you are never unclipped.",
      lv: { mild: { q: "What happens straight after the safety talk?",
          fig: KIT,
          options: ["Put the kit on, and let the instructor check it", "Climb straight to [[top]]", "Take the helmet off"],
          slips: { 1: "The kit needs to go on and be checked first.", 2: "The helmet stays on the whole time." },
          hint: "What do you need before you climb?",
          why: "Kit on, then the instructor checks it. Then it is your turn." },
        spicy: { q: "Use the risk grid. Slipping on the wet path is likely (3) but not very bad (1). Falling off the wall unclipped is not likely (1) but very bad (3). Which is true?",
          fig: grid(),
          options: ["Both score 3, so both need a plan", "The path scores 3 and the wall scores 1", "Only the wall matters, because it is high", "The path scores 4"],
          slips: { 1: "The wall is 1 x 3. That is 3 too.", 2: "A likely slip needs a plan too, even if it is not very bad.", 3: "It is times, not add: 3 x 1 = 3." },
          hint: "Score = how likely x how bad.",
          why: "Path: 3 x 1 = 3. Wall: 1 x 3 = 3. Both need a plan: grippy shoes for the path, clips for the wall." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Having a go, your way", title: "Comfort, stretch, too much",
      fig: zones(false),
      html: "<p>The middle is your <b>comfort zone</b>: easy and safe. Around it is the <b>stretch zone</b>: a bit wobbly, and that is where you learn. On the outside is <b>too much</b>: your body says stop.</p>" +
        "<p>Adventure days work on <b>challenge by choice</b>. You choose how far to go. Climbing to the third hold is a win if that was your stretch.</p>" +
        "<p>If it starts to feel like too much, you can come down, have a breather, and try again later. Or not.</p>",
      lv: { spicy: { html: "<p>The middle is your <b>comfort zone</b>. Around it is the <b>stretch zone</b>, where learning happens. On the outside is <b>too much</b>, where your body goes into alarm and learning stops.</p>" +
        "<p>Everyone's zones are different, and they move. Something that was a stretch last time can be comfort next time.</p>" +
        "<p><b>Challenge by choice</b> means you pick your own stretch. A good instructor, or a good friend, helps you find it without pushing you into too much.</p>" } } },

    { type: "mc", topic: "Having a go, your way",
      q: "You are at the bottom of the wall and your heart is thumping. What could help?",
      options: ["A few slow breaths, then try just the first two holds", "Rush to [[top]] to get it over with", "Pretend you are fine and say nothing"],
      answer: 0,
      slips: { 1: "Rushing can tip you into too much. Small steps keep it in the stretch zone.", 2: "Telling the instructor how you feel helps them help you." },
      hint: "Small steps, and a calm body.",
      why: "Slow breaths calm your body, and a small first goal keeps it in your stretch zone. That counts as a win." },

    { type: "sort", topic: "Having a go, your way",
      q: "For someone who has never climbed before, which zone is each one likely to be?",
      buckets: ["Comfort", "Stretch", "Too much"],
      cards: [["Watching from the bench", 0], ["Climbing to the first coloured hold", 1], ["Racing to [[top]] with no practice", 2], ["Putting the helmet on", 0], ["Climbing halfway, then coming down", 1]],
      hint: "Comfort is easy. Stretch is a bit wobbly. Too much is a big leap.",
      why: "A first go a little way up is a perfect stretch. Racing to the top with no practice is a big leap for most people.",
      lv: { mild: { cards: [["Watching from the bench", 0], ["Climbing to the first coloured hold", 1], ["Racing to [[top]] with no practice", 2]] } } },

    { type: "num", topic: "Having a go, your way", explain: true,
      q: "Box breathing: breathe in for 4, hold for 4, out for 4, hold for 4. How many counts is one whole box?",
      fig: BOX,
      boxes: [{ label: "Counts", a: 16 }],
      slips: [[4, "That is one side. There are four sides, each 4 counts."], [12, "Close. Go round all four sides: in, hold, out, hold."], [8, "That is two sides. Keep going round."]],
      hint: "Four sides, four counts on each side.",
      why: "4 + 4 + 4 + 4 = <b>16</b> counts. Three boxes is about a minute, and your heart slows down.",
      lv: { spicy: { q: "Box breathing: in 4, hold 4, out 4, hold 4. One count is about one second. How many whole boxes fit in one minute?",
        boxes: [{ label: "Boxes", a: 3 }],
        slips: [[16, "That is the counts in one box. How many lots of 16 fit into 60?"], [4, "4 boxes would be 64 seconds, just over a minute."], [15, "60 divided by 4 is 15. But one box is 16 counts, not 4."]],
        hint: "One box is 16 seconds. How many 16s fit into 60?",
        why: "16 x 3 = 48 and 16 x 4 = 64. So <b>3</b> whole boxes fit in a minute." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Looking back", title: "Looking back makes the next go easier",
      fig: REFLECT,
      html: "<p>After the activity, have a think, if you like: <b>what went well</b>, <b>what was tricky</b>, and <b>what could I try next</b>.</p>" +
        "<p>Looking back is about noticing, not marking. \"I got to the second hold and then needed a rest\" is a brilliant thing to notice.</p>",
      lv: { spicy: { html: "<p>After the activity, look back: <b>what went well</b>, <b>what was tricky</b>, <b>what could I try next</b>.</p>" +
        "<p>Good reflections are <b>specific</b>. \"It was fine\" tells you nothing next time. \"My legs did the work when I stood up on the holds, my arms got tired when I pulled\" tells you exactly what to try.</p>" +
        "<p>You can also notice how you helped others: cheering, holding a ladder, waiting your turn.</p>" } } },

    { type: "mc", topic: "Looking back",
      q: "Which one is the most helpful thing to notice after a climb?",
      options: ["I got to the third hold, and my legs did most of the work", "I was rubbish", "It was fine"],
      answer: 0,
      slips: { 1: "That is a harsh one, and it does not tell you what to try next. What actually happened?", 2: "Fine is OK, but it does not say what happened. What would help next time?" },
      hint: "Which one says exactly what happened?",
      why: "It says how far you got and what worked. Next time you know to use your legs more.",
      lv: { spicy: { q: "Which reflection would help most next time?",
        options: ["My arms got tired when I pulled. Next time I will push up with my legs.", "It was the best day ever.", "I did not like it.", "Everyone else was better than me."],
        slips: { 1: "Lovely to hear, but it does not say what to do next time.", 2: "That is real and fair, but what made it hard? That bit helps.", 3: "Comparing does not help you. What happened for you?" },
        why: "It names what happened and a plan for next time. That is a reflection you can use." } } },

    { type: "widget", topic: "Looking back", unscored: true,
      title: "Where were you?",
      html: "<p>Tap where you think you will be before you try, and where you ended up after, if you like.</p>",
      mount: zoneWidget,
      report: function(d){ return d && (d.before || d.after) ? "Zones: before " + (d.before || "-") + ", after " + (d.after || "-") + "." : ""; } },

    { type: "write", topic: "Looking back",
      q: "After your adventure day, have a go at writing about it, if you like. What did you do, what went well, what was tricky, and what could you try next? Jay would love to read it.",
      starters: ["I tried", "Something that went well was", "Something tricky was", "Next time I could"],
      checklist: ["What I did", "Something that went well", "Something tricky", "What I could try next"],
      minWords: 30 },

    { type: "widget", topic: "Looking back", unscored: true,
      title: "Take it with you",
      html: "<p>A checklist for the day itself. Use it on a phone or print the page, whatever suits.</p>",
      mount: checkWidget,
      report: function(d){ var n = d && d.ticks ? d.ticks.filter(Boolean).length : 0; return n ? "Adventure day challenge: " + n + " of " + CHALLENGE.length + " ticked." : ""; } }
  ],

  realWorld: {
    title: "Outdoor instructors do this every day",
    html: "<p>Climbing instructors, lifeguards and outdoor centre staff check kit, give safety talks, and help people find their stretch zone. It is a real job, and you can start training for it at college.</p>" +
      "<p>For our big question: if we could time travel, should we? It would be the biggest adventure of all. What would your safety talk say before the jump?</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay by a time portal, thinking about a safety talk">' + A2ART.portal(80, 75, 58) + A2ART.jay(240, 46, 0.85, "wow") +
      A2ART.bubble(290, 6, 120, 52, "Helmets on,\neveryone.", 294) + '</svg>'
  },

  make: {
    title: "Make an adventure badge",
    intro: "A badge for what you tried. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "act", label: "What I tried", ph: "The climbing wall", max: 30 },
      { id: "got", label: "How far I got", ph: "Halfway up, then a rest", max: 50 },
      { id: "next", label: "Next time I could", ph: "Try the blue route", max: 50 },
      { id: "name", label: "Adventurer", ph: "The Brave One", max: 24 }
    ],
    svg: function(v){
      var act = wrap(v.act, 13, 2), got = wrap(v.got, 26, 3), nx = wrap(v.next, 26, 3);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="24" fill="#fdf6e3"/>' +
        '<path d="M120 200l-40 150 40 -20 30 34 30 -130z" fill="#e04848"/><path d="M180 200l40 150 -40 -20 -30 34 -30 -130z" fill="#3a8fd6"/>' +
        '<circle cx="150" cy="150" r="112" fill="#ffd23f" stroke="#141a33" stroke-width="5"/>' +
        '<circle cx="150" cy="150" r="92" fill="none" stroke="#141a33" stroke-width="2.5" stroke-dasharray="8 6"/>' +
        '<path d="M96 120l30 -36 18 22 14 -16 32 30" fill="none" stroke="#141a33" stroke-width="5" stroke-linejoin="round"/>' +
        act.map(function(l, k){ return T(150, 172 + k * 26, esc(l), 20, { b: 1, a: "middle" }); }).join("") +
        T(300, 70, "ADVENTURE BADGE", 24, { b: 1, c: "#e04848" }) +
        T(300, 120, "How far I got", 15, { b: 1, c: "#5b6180" }) +
        got.map(function(l, k){ return T(300, 146 + k * 23, esc(l), 17); }).join("") +
        T(300, 232, "Next time", 15, { b: 1, c: "#5b6180" }) +
        nx.map(function(l, k){ return T(300, 258 + k * 23, esc(l), 17); }).join("") +
        T(300, 350, "Adventurer:", 15, { b: 1, c: "#5b6180" }) + T(300, 378, esc(wrap(v.name, 22, 1)[0] || ""), 22, { b: 1 }) +
        '</svg>';
    }
  }
};
})();
