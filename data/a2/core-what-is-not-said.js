/* Base 5 core target activity: What is not said.
   English. Inference from images (adverts, photos, posters drawn in SVG)
   and from texts, then commenting on the implied meaning with evidence.
   Always available and replayable (vary). ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function svg(w, h, label, body){ return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '">' + body + '</svg>'; }

/* start card: an eye and a speech bubble with nothing in it */
var START = svg(520, 190, "An eye looking at an empty speech bubble: what is not said",
  '<rect width="520" height="190" rx="16" fill="#1f3b4d"/>' +
  '<path d="M60 95q90 -80 180 0q-90 80 -180 0z" fill="#ffffff" stroke="#141a33" stroke-width="3"/><circle cx="150" cy="95" r="30" fill="#19c39a"/><circle cx="150" cy="95" r="14" fill="#141a33"/><circle cx="158" cy="87" r="5" fill="#ffffff"/>' +
  '<path d="M300 40h170q16 0 16 16v64q0 16 -16 16h-120l-26 22 4 -22h-28q-16 0 -16 -16v-64q0 -16 16 -16z" fill="#ffffff" stroke="#141a33" stroke-width="3"/>' +
  T(392, 96, ". . .", 26, { a: "middle", b: 1, c: "#9aa3bd" }) +
  A.egg(A.bird(470, 168, 0.6, "#ffd23f"), "A bird who says nothing at all, and yet you can tell it wants seeds. Inference.") );

/* learn: Bonnie by the door */
var BONNIE = svg(520, 230, "Bonnie sits by the front door staring at her lead on its hook, next to an empty bowl. I can see the clues; they suggest she wants a walk.",
  '<rect width="520" height="230" rx="16" fill="#fff6e8"/>' +
  '<path d="M0 196h520" stroke="#c9b28f" stroke-width="4"/>' +
  '<rect x="380" y="40" width="96" height="156" rx="4" fill="#8a5a36" stroke="#141a33" stroke-width="3"/><circle cx="392" cy="122" r="5" fill="#ffd23f"/>' +
  '<path d="M356 70h12" stroke="#141a33" stroke-width="4" stroke-linecap="round"/><path d="M362 70q-8 30 4 52q6 10 -2 18" fill="none" stroke="#e04848" stroke-width="4"/><rect x="356" y="136" width="14" height="8" rx="2" fill="#e04848"/>' +
  A.bonnie(318, 158, 0.9, "sit") +
  '<ellipse cx="250" cy="192" rx="24" ry="7" fill="#22b8e6" stroke="#141a33" stroke-width="2"/>' +
  '<rect x="20" y="22" width="200" height="68" rx="12" fill="#ffd23f" fill-opacity=".55" stroke="#141a33" stroke-width="2"/>' + T(34, 46, "I can see", 14, { b: 1 }) + T(34, 66, "Bonnie by the door,", 13) + T(34, 82, "staring at her lead.", 13) +
  '<path d="M120 94v14l-5 -5M120 108l5 -5" stroke="#141a33" stroke-width="2.5" fill="none"/>' +
  '<rect x="20" y="114" width="200" height="56" rx="12" fill="#9be3c6" stroke="#141a33" stroke-width="2"/>' + T(34, 138, "It suggests", 14, { b: 1 }) + T(34, 158, "she wants a walk.", 13) );

/* someone leaving: rain, suitcase, one way ticket, photo face down */
var LEAVE = svg(520, 240, "A room on a rainy day. A packed suitcase with a coat on top waits by the door. A ticket on the case says ONE WAY. A photo frame lies face down on the shelf. The coat hook is empty.",
  '<rect width="520" height="240" rx="16" fill="#e7ecf3"/>' +
  '<rect x="30" y="26" width="140" height="110" rx="4" fill="#9aa9bd" stroke="#141a33" stroke-width="3"/><path d="M100 26v110M30 81h140" stroke="#141a33" stroke-width="3"/>' +
  '<ellipse cx="80" cy="46" rx="34" ry="12" fill="#6b7a90"/><ellipse cx="128" cy="52" rx="30" ry="10" fill="#6b7a90"/>' +
  '<path d="M48 66l-6 14M70 92l-6 14M120 70l-6 14M150 96l-6 14M92 110l-6 14M58 112l-4 10" stroke="#ffffff" stroke-width="2"/>' +
  '<path d="M200 70h120" stroke="#8a5a36" stroke-width="6"/><rect x="226" y="58" width="52" height="9" rx="2" fill="#6b3f1f" stroke="#141a33" stroke-width="1.5"/><rect x="232" y="60" width="40" height="5" fill="#c9b28f"/>' + T(252, 88, "photo, face down", 11, { a: "middle", c: "#3a4060" }) +
  '<rect x="346" y="40" width="30" height="8" rx="2" fill="#8a5a36"/><path d="M361 48v12q0 8 8 8" fill="none" stroke="#141a33" stroke-width="3" stroke-linecap="round"/>' + T(361, 86, "empty hook", 11, { a: "middle", c: "#3a4060" }) +
  '<rect x="410" y="30" width="90" height="176" rx="4" fill="#8a5a36" stroke="#141a33" stroke-width="3"/><circle cx="422" cy="122" r="5" fill="#ffd23f"/>' +
  '<path d="M0 206h520" stroke="#141a33" stroke-opacity=".3" stroke-width="3"/>' +
  '<rect x="300" y="122" width="96" height="84" rx="8" fill="#ff5d8f" stroke="#141a33" stroke-width="3"/><path d="M330 122v-12h36v12" fill="none" stroke="#141a33" stroke-width="4"/><path d="M300 150h96" stroke="#141a33" stroke-width="2"/>' +
  '<path d="M300 126q20 -10 50 -4q30 6 46 -2v18q-20 6 -48 0q-28 -6 -48 4z" fill="#2f6f8f"/>' +
  '<g transform="translate(330 166) rotate(-6)"><rect x="0" y="0" width="58" height="26" rx="3" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(29, 18, "ONE WAY", 10, { a: "middle", b: 1 }) + '</g>' );

/* a phone: message seen, no reply */
var SEEN = svg(520, 240, "A phone screen. The time is 4:41. A message sent says: Are we still meeting at 4? Underneath: Seen 3:02. There is no reply.",
  '<rect width="520" height="240" rx="16" fill="#f0eefc"/>' +
  '<rect x="180" y="12" width="160" height="216" rx="22" fill="#141a33"/><rect x="190" y="30" width="140" height="180" rx="8" fill="#ffffff"/>' +
  T(200, 46, "4:41", 12, { b: 1 }) + '<rect x="300" y="38" width="20" height="9" rx="2" fill="none" stroke="#141a33" stroke-width="1.5"/><rect x="302" y="40" width="5" height="5" fill="#e04848"/>' +
  '<rect x="216" y="70" width="106" height="44" rx="12" fill="#22b8e6"/>' + T(226, 88, "Are we still", 12, { c: "#ffffff" }) + T(226, 104, "meeting at 4?", 12, { c: "#ffffff" }) +
  T(320, 128, "Seen 3:02", 10, { a: "end", c: "#5b6180" }) +
  '<path d="M200 190h120" stroke="#e0e3ef" stroke-width="18" stroke-linecap="round"/>' +
  '<g transform="translate(420 120)"><circle r="40" fill="#ffffff" stroke="#141a33" stroke-width="3"/><path d="M0 0v-28M0 0l20 10" stroke="#141a33" stroke-width="3" stroke-linecap="round"/></g>' +
  T(420, 184, "the clock", 12, { a: "middle" }) );

/* muddy boots and a medal */
var BOOTS = svg(520, 220, "Muddy football boots by a door, a trail of muddy footprints, and a medal with a 1st ribbon hanging on the coat hook",
  '<rect width="520" height="220" rx="16" fill="#eef6ee"/>' +
  '<rect x="380" y="20" width="100" height="170" rx="4" fill="#5b6180" stroke="#141a33" stroke-width="3"/>' +
  '<path d="M0 190h520" stroke="#8a5a36" stroke-width="4"/>' +
  '<path d="M330 40h16" stroke="#141a33" stroke-width="4" stroke-linecap="round"/><path d="M332 40l6 36M344 40l-6 36" stroke="#e04848" stroke-width="4"/><circle cx="338" cy="90" r="14" fill="#ffd23f" stroke="#141a33" stroke-width="2"/>' + T(338, 95, "1st", 10, { a: "middle", b: 1 }) +
  '<g transform="translate(236 150)"><path d="M0 0h24v20q0 6 8 8l22 6q8 3 8 10v4H0z" fill="#141a33"/><path d="M4 6h16M4 12h16" stroke="#ffffff" stroke-width="2"/><circle cx="8" cy="52" r="3" fill="#141a33"/><circle cx="26" cy="52" r="3" fill="#141a33"/><circle cx="48" cy="52" r="3" fill="#141a33"/><path d="M-2 44q20 -6 66 2v4H-2z" fill="#7a5532"/><circle cx="14" cy="30" r="5" fill="#7a5532"/><circle cx="40" cy="34" r="4" fill="#7a5532"/></g>' +
  '<g transform="translate(300 150)"><path d="M0 0h24v20q0 6 8 8l22 6q8 3 8 10v4H0z" fill="#141a33"/><path d="M4 6h16M4 12h16" stroke="#ffffff" stroke-width="2"/><circle cx="8" cy="52" r="3" fill="#141a33"/><circle cx="26" cy="52" r="3" fill="#141a33"/><circle cx="48" cy="52" r="3" fill="#141a33"/><path d="M-2 44q20 -6 66 2v4H-2z" fill="#7a5532"/><circle cx="14" cy="30" r="5" fill="#7a5532"/><circle cx="40" cy="34" r="4" fill="#7a5532"/></g>' +
  [[60, 184], [110, 178], [160, 184], [205, 178]].map(function(p){ return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="14" ry="5" fill="#7a5532"/>'; }).join("") );

/* trainer advert */
var SHOE = svg(520, 240, "An advert for AIRZ trainers. A trainer streaks forward with lightning lines behind it, above a winner's podium with a gold number 1. The slogan says: Leave them behind.",
  '<rect width="520" height="240" rx="16" fill="#141a33"/>' +
  '<path d="M40 70h120M20 96h150M50 122h110" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/><path d="M120 40l-20 34h18l-14 30 36 -42h-20l14 -22z" fill="#ffd23f"/>' +
  '<path d="M180 120q10 -40 60 -44l40 4q20 20 70 24q30 4 30 26v12h-200z" fill="#ffffff" stroke="#22b8e6" stroke-width="4"/><path d="M180 142h200" stroke="#22b8e6" stroke-width="6"/><path d="M240 96l20 20M260 92l18 22M280 92l16 22" stroke="#141a33" stroke-width="3"/>' +
  '<rect x="400" y="150" width="60" height="60" fill="#ffd23f"/><rect x="340" y="176" width="60" height="34" fill="#c0c6d6"/><rect x="460" y="186" width="40" height="24" fill="#c98a4b"/>' + T(430, 190, "1", 30, { a: "middle", b: 1 }) +
  T(30, 196, "AIRZ", 30, { b: 1, c: "#ffffff" }) + T(30, 222, "Leave them behind.", 15, { b: 1, c: "#22b8e6" }) );

/* juice advert */
var JUICE = svg(520, 240, "An advert for PURE juice. The bottle stands in front of snowy mountains, a waterfall and green leaves in sunshine. The slogan says: Taste the mountains.",
  '<rect width="520" height="240" rx="16" fill="#cdeefd"/>' +
  '<circle cx="440" cy="50" r="26" fill="#ffd23f"/>' +
  '<path d="M0 200L110 70l60 60 80 -100 110 130 70 -50 90 90z" fill="#7fa6c9"/><path d="M110 70l26 30h-46zM250 30l30 36h-56z" fill="#ffffff"/>' +
  '<path d="M335 122q6 40 0 78" stroke="#ffffff" stroke-width="12" fill="none" stroke-opacity=".9"/>' +
  '<path d="M0 200h520v24q0 16 -16 16H16q-16 0 -16 -16z" fill="#3fa35b"/>' +
  '<path d="M60 206q30 -40 60 -10q-30 24 -60 10zM420 206q30 -40 60 -10q-30 24 -60 10z" fill="#19c39a" stroke="#141a33" stroke-width="1.5"/>' +
  '<rect x="214" y="96" width="70" height="120" rx="14" fill="#ffb347" stroke="#141a33" stroke-width="3"/><rect x="234" y="76" width="30" height="22" rx="4" fill="#3fa35b" stroke="#141a33" stroke-width="2"/>' +
  '<rect x="220" y="136" width="58" height="34" rx="6" fill="#ffffff"/>' + T(249, 159, "PURE", 14, { a: "middle", b: 1, c: "#3fa35b" }) +
  T(30, 34, "Taste the mountains.", 18, { b: 1, c: "#1d4e89" }) );

/* phone advert */
var PHONEAD = svg(520, 240, "An advert for the Nova phone. The phone is in the middle, surrounded by six smiling friends and confetti. The slogan says: Never miss a moment.",
  '<rect width="520" height="240" rx="16" fill="#fff0f6"/>' +
  [[90, 70, "#f6d1b0"], [150, 40, "#c98a5b"], [370, 40, "#f0c4a0"], [430, 70, "#8a5a36"], [80, 160, "#e8b48a"], [440, 160, "#f6d1b0"]].map(function(p){
    return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="24" fill="' + p[2] + '" stroke="#141a33" stroke-width="2"/><circle cx="' + (p[0] - 8) + '" cy="' + (p[1] - 4) + '" r="3" fill="#141a33"/><circle cx="' + (p[0] + 8) + '" cy="' + (p[1] - 4) + '" r="3" fill="#141a33"/><path d="M' + (p[0] - 10) + ' ' + (p[1] + 6) + 'q10 10 20 0" fill="none" stroke="#141a33" stroke-width="2.5" stroke-linecap="round"/>';
  }).join("") +
  [[200, 30, "#ffd23f"], [320, 26, "#22b8e6"], [140, 120, "#ff5d8f"], [380, 120, "#19c39a"], [480, 206, "#8a5cf6"]].map(function(c){ return '<rect x="' + c[0] + '" y="' + c[1] + '" width="10" height="5" fill="' + c[2] + '" transform="rotate(30 ' + c[0] + ' ' + c[1] + ')"/>'; }).join("") +
  '<rect x="220" y="50" width="80" height="150" rx="14" fill="#141a33"/><rect x="228" y="62" width="64" height="122" rx="6" fill="#22b8e6"/>' + T(260, 128, "NOVA", 14, { a: "middle", b: 1, c: "#ffffff" }) +
  T(260, 230, "Never miss a moment.", 15, { a: "middle", b: 1, c: "#8a2d58" }) );

/* litter poster */
var BOTTLE = svg(520, 240, "A poster. Under the sea, a small fish swims inside a plastic bottle. The words say: Your bottle. Their home.",
  '<rect width="520" height="240" rx="16" fill="#1d6fa3"/>' +
  '<path d="M0 30q40 -12 80 0t80 0t80 0t80 0t80 0t80 0t40 0" fill="none" stroke="#9cd5f5" stroke-width="3"/>' +
  '<path d="M0 220q60 -20 140 -6q80 14 160 0q100 -16 220 6v4q0 16 -16 16H16q-16 0 -16 -16z" fill="#e0c48f"/>' +
  '<g transform="translate(150 70) rotate(-12)"><rect x="0" y="0" width="190" height="80" rx="30" fill="#ffffff" fill-opacity=".35" stroke="#ffffff" stroke-width="3"/><rect x="190" y="22" width="30" height="36" rx="4" fill="#ffffff" fill-opacity=".35" stroke="#ffffff" stroke-width="3"/><rect x="218" y="18" width="12" height="44" rx="3" fill="#e04848"/>' +
  '<g transform="translate(90 42)"><ellipse rx="26" ry="14" fill="#ff8a5c"/><path d="M24 0l18 -12v24z" fill="#ff8a5c"/><circle cx="-14" cy="-3" r="3" fill="#141a33"/></g></g>' +
  '<circle cx="90" cy="80" r="5" fill="none" stroke="#ffffff"/><circle cx="104" cy="60" r="3" fill="none" stroke="#ffffff"/>' +
  T(30, 196, "Your bottle.", 20, { b: 1, c: "#ffffff" }) + T(200, 196, "Their home.", 20, { b: 1, c: "#ffd23f" }) );

/* see it, suggest it, say why */
var SSB = svg(520, 180, "A comment in three parts: I can see, this suggests, because",
  '<rect width="520" height="180" rx="16" fill="#f4f1ea"/>' +
  [["I can see", "the clue", "#ffd23f"], ["This suggests", "the idea", "#9be3c6"], ["Because", "the link", "#c9b8ff"]].map(function(c, k){
    var x = 16 + k * 128;
    return '<rect x="' + x + '" y="30" width="114" height="92" rx="12" fill="' + c[2] + '" stroke="#141a33" stroke-width="2"/>' +
      T(x + 57, 66, c[0], 14, { a: "middle", b: 1 }) + T(x + 57, 94, c[1], 13, { a: "middle" }) +
      (k < 2 ? '<path d="M' + (x + 116) + ' 76h10l-4 -5M' + (x + 126) + ' 76l-4 5" stroke="#141a33" stroke-width="2" fill="none"/>' : "");
  }).join("") +
  A.jay(446, 96, 0.72, "hmm") + A.bubble(398, 4, 114, 40, "Prove it.", 440) +
  T(16, 160, "Spicy extra: \"It could also suggest...\"", 13, { b: 1 }) );

(window.A2PACKS = window.A2PACKS || {})["core-what-is-not-said"] = {
  a2: true,
  id: "a2-core-what-is-not-said",
  title: "What is not said",
  subject: "English",
  bodyClass: "subj-eng",
  mins: 25,
  line: "Pictures, adverts and writers say more than their words. Find the clue, work out the idea, then back it up.",
  blurb: "Working out what a picture, an advert, a poster or a piece of writing suggests without saying it, and backing your idea up with evidence. Four short chunks, then a card to make. New pictures and texts every time you come back.",
  note: "What is not said: reading pictures, adverts and texts for what they suggest. Four five minute chunks and a card to make. It changes each time, so come back to it whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Glimpse", line: "Glimpse: what can you see, and what might it mean?" },
    { id: "medium", name: "Hunch", line: "Hunch: work out the idea and point to the clue." },
    { id: "spicy", name: "Hidden depths", line: "Hidden depths: precise ideas, evidence, and other ways to read it." }
  ],
  themes: {
    time: { name: "Time travel", w: { who: "Zed the time traveller", place: "the time lab", kit: "the time map" } },
    football: { name: "Football", w: { who: "the new striker", place: "the changing room", kit: "the team sheet" } },
    horror: { name: "Horror", w: { who: "the night porter", place: "the old hospital", kit: "the torch" } },
    fishing: { name: "Fishing", w: { who: "the young angler", place: "the boat house", kit: "the tackle box" } },
    music: { name: "Music", w: { who: "the lead singer", place: "the recording studio", kit: "the set list" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: START,
  steps: [

    /* ---------- chunk 1: pictures ---------- */
    { type: "learn", topic: "Pictures say things", title: "See it, then work out what it suggests",
      fig: BONNIE,
      ez: { title: "See it, work it out", html: "<p>Bonnie stares at her lead. She wants a walk!</p><p>Working it out from clues is <b>inference</b>.</p>" },
      html: "<p>Nobody in this picture says \"Bonnie wants a walk\". But you can tell.</p>" +
        "<p><b>What you see</b> is the evidence: Bonnie by the door, staring at her lead. <b>What it suggests</b> is the idea you work out from it: she wants a walk. That working out is called <b>inference</b>. The meaning that is suggested but not said is <b>implicit</b> meaning.</p>" +
        "<p>Hidden depths: a strong inference is <b>precise</b> (not just \"she is a dog\") and <b>fits all the clues</b>. Sometimes a picture can suggest more than one thing, and saying so is a strength.</p>",
      lv: { mild: { html: "<p>Nobody says \"Bonnie wants a walk\". But you can tell.</p>" +
        "<p><b>What you see:</b> Bonnie by the door, staring at her lead.<br><b>What it suggests:</b> she wants a walk.</p>" +
        "<p>Working it out from clues is called <b>inference</b>.</p>" } } },

    { type: "mc", topic: "Pictures say things",
      q: "What does this picture suggest?",
      fig: LEAVE,
      options: ["Someone is leaving home for a long time, and it may be a sad goodbye", "Someone has just arrived home from a happy holiday", "Someone is going out to the shop for ten minutes", "Someone is redecorating their room"],
      answer: 0,
      ez: { q: "What is someone about to do?", why: "<b>Go away</b>. The suitcase is by the door.", slips: { 1: "No bed here. Look by the door.", 2: "No kitchen here. Look by the door." } },
      slips: { 1: "The case is by the door ready to go, and the ticket says one way. That suggests leaving, not arriving.", 2: "You would not pack a whole suitcase for the shop.", 3: "No paint or tools here. Look at the case and the ticket." },
      hint: "Look at the ticket, the photo on the shelf and the weather.",
      why: "The packed case and one way ticket suggest leaving and not coming back. The face down photo and the rain hint that it is a sad goodbye.",
      lv: { mild: { q: "Look at the picture. What is someone about to do?",
        options: ["Go away somewhere", "Go to sleep", "Cook dinner"],
        slips: { 1: "No bed here. Look at what is by the door.", 2: "No kitchen here. Look at what is by the door." },
        hint: "What is by the door?", why: "A packed suitcase by the door suggests someone is going away." } },
      vary: [
        { q: "What does this picture suggest?", fig: SEEN,
          options: ["The friend has read the message but not replied, so the sender is left waiting and probably feels let down", "The friend replied straight away", "The meeting went really well", "The phone is broken"],
          answer: 0,
          ez: { q: "Has the friend replied?", hint: "Is there a reply bubble?", why: "<b>No</b>. It says Seen, but no reply.", slips: { 1: "Look again. It just says Seen.", 2: "There is no reply at all." } },
          slips: { 1: "There is no reply on the screen, only \"Seen\".", 2: "It is 4:41 and still no answer to \"are we still meeting at 4?\"", 3: "The phone is working: it shows the time and the message." },
          hint: "Look at \"Seen 3:02\" and then the time now.",
          why: "Seen at 3:02, no reply by 4:41. Nobody says \"I have been ignored\", but the clues suggest it.",
          lv: { mild: { q: "Look at the phone. Has the friend replied?", fig: SEEN,
            options: ["No: they saw it but did not reply", "Yes, they said yes", "Yes, they said no"],
            slips: { 1: "Look again: there is no reply, just Seen.", 2: "There is no reply at all." },
            hint: "Is there a reply under the message?", why: "It says Seen, but there is no reply. They are being left waiting." } } },
        { q: "What does this picture suggest?", fig: BOOTS,
          options: ["Someone has just come home from a muddy football match, and they won", "Someone is about to go out to play for the first time", "Someone lost a match and threw their medal away", "Someone has been gardening"],
          answer: 0,
          ez: { q: "What has someone just done?", hint: "Look at the boots and medal.", why: "Muddy boots and a 1st medal. They <b>played and won</b>.", slips: { 1: "Football boots, not swimming things.", 2: "No cake. Look at the boots." } },
          slips: { 1: "The mud is already on the boots and floor. They have already played.", 2: "The medal says 1st and is hung up carefully, not thrown away.", 3: "Football boots and a medal point to a match, not gardening." },
          hint: "What does the medal say? Where are the footprints going?",
          why: "Muddy boots and footprints suggest they have just got in. The 1st medal hung up suggests they won and are proud of it.",
          lv: { mild: { q: "Look at the picture. What has someone just done?", fig: BOOTS,
            options: ["Played football and won", "Gone swimming", "Baked a cake"],
            slips: { 1: "Football boots, not swimming things.", 2: "No cake. Look at the boots and the medal." },
            hint: "Look at the boots and the medal.", why: "Muddy football boots and a 1st medal suggest they played and won." } } }
      ] },

    { type: "multi", topic: "Pictures say things",
      q: "Which clues in the picture suggest the person is <b>not coming back soon</b>? Pick <b>all</b> that do.",
      fig: LEAVE,
      options: ["The ticket says ONE WAY", "A whole suitcase is packed", "The coat hook is empty", "The door is brown", "There is a shelf"],
      answers: [0, 1, 2],
      ez: { q: "Pick <b>two</b> clues that show going away.", hint: "Which ones are about leaving?", why: "The <b>suitcase</b> and the <b>ticket</b>.", slips: { any: "Two are clues. The door colour is not." } },
      slips: { any: "Three of them are clues. The colour of the door and the shelf being there do not tell you anything about leaving." },
      hint: "Which details would be different if they were just popping out?",
      why: "One way, a big packed case and an empty hook all point the same way. Good inference uses clues that actually connect to the idea.",
      lv: { mild: { q: "Which <b>two</b> things show someone is going away?", options: ["The packed suitcase", "The ticket", "The colour of the door"], answers: [0, 1],
        slips: { any: "Two of them are clues. The door colour does not tell you anything." }, why: "The suitcase and the ticket show someone is going away." } },
      vary: [
        { q: "Which clues suggest the sender of the message feels <b>let down</b>? Pick <b>all</b> that do.", fig: SEEN,
          options: ["It says Seen, but there is no reply", "The time is 4:41, after the meeting time", "The question asks if they are still meeting", "The message bubble is blue", "The phone has a clock"],
          answers: [0, 1, 2],
          ez: { q: "Pick <b>two</b> clues that show no reply.", hint: "Look for the word Seen.", why: "<b>Seen</b>, and no reply bubble.", slips: { any: "Two are clues. The colour is not." } },
          slips: { any: "Three are clues. The colour of the bubble and the phone having a clock do not show feelings on their own." },
          why: "Seen with no reply, the time passing 4, and a question that needed an answer: together they suggest being let down.",
          lv: { mild: { q: "Which <b>two</b> things show the friend has not replied?", fig: SEEN, options: ["It says Seen", "There is no reply bubble", "The bubble is blue"], answers: [0, 1],
            slips: { any: "Two of them are clues. The colour is not." }, why: "Seen, and no reply bubble." } } },
        { q: "Which clues suggest the team <b>won</b>? Pick <b>all</b> that do.", fig: BOOTS,
          options: ["The medal says 1st", "The medal is hung up where it can be seen", "The ribbon is red", "The boots are black", "There is a door"],
          answers: [0, 1],
          ez: { q: "Which thing shows they <b>won</b>?", hint: "Look for 1st.", why: "The medal says <b>1st</b>.", slips: { any: "Find the one that says 1st." } },
          slips: { any: "Two of them are clues to winning. The colours and the door do not tell you who won." },
          why: "A 1st medal is the main clue. Hanging it up on show suggests they are proud of it.",
          lv: { mild: { q: "Which thing shows they <b>won</b>?", fig: BOOTS, options: ["The 1st medal", "The door", "The floor"], answers: [0],
            slips: { any: "Look for the one that says 1st." }, why: "The medal says 1st." } } }
      ] },

    { type: "sort", topic: "Pictures say things",
      q: "Look at the picture again. Sort: can you <b>see</b> it, or is it <b>suggested</b>?",
      fig: LEAVE,
      ez: { q: "Can you <b>see</b> it, or <b>work it out</b>?", why: "You can point at the case and rain. Feelings you work out.", slips: { any: "Can you point at it? Then you can see it." } },
      buckets: ["I can see it", "It is suggested"],
      cards: [["There is a suitcase by the door", 0], ["The ticket says ONE WAY", 0], ["It is raining", 0], ["The person is moving away", 1], ["They feel sad about leaving", 1], ["Someone in the photo reminds them of home", 1]],
      slips: { any: "Ask: could you point at it in the picture? If you have to work it out, it is suggested." },
      hint: "Could you point at it?",
      why: "You can point at the case, the ticket and the rain. Moving away, feeling sad and the photo's meaning are ideas you work out.",
      lv: { mild: { q: "Sort: can you <b>see</b> it, or do you <b>work it out</b>?", buckets: ["I can see it", "I work it out"], cards: [["A suitcase", 0], ["Rain", 0], ["They are going away", 1], ["They feel sad", 1]] } },
      vary: [
        { fig: SEEN,
          cards: [["The message asks about meeting at 4", 0], ["It says Seen 3:02", 0], ["The time is 4:41", 0], ["The friend is ignoring them", 1], ["The sender feels let down", 1], ["The plans are off", 1]],
          ez: { q: "Can you <b>see</b> it, or <b>work it out</b>?", hint: "Could you point at it?", why: "You can see the words. Feelings you work out.", slips: { any: "Can you point at it? Then you can see it." } },
          why: "The words and times are on the screen. Ignoring, feeling let down and plans being off are worked out.",
          lv: { mild: { q: "Sort: can you <b>see</b> it, or do you <b>work it out</b>?", buckets: ["I can see it", "I work it out"], cards: [["The word Seen", 0], ["The time 4:41", 0], ["The friend is ignoring them", 1], ["The sender feels sad", 1]] } } },
        { fig: BOOTS,
          cards: [["There is mud on the boots", 0], ["The medal says 1st", 0], ["There are footprints", 0], ["It rained during the match", 1], ["Their team won", 1], ["They are proud", 1]],
          ez: { q: "Can you <b>see</b> it, or <b>work it out</b>?", hint: "Could you point at it?", why: "You can see boots and a medal. Winning you work out.", slips: { any: "Can you point at it? Then you can see it." } },
          why: "Mud, the medal and footprints are there to point at. Rain, winning and pride are ideas the clues suggest.",
          lv: { mild: { q: "Sort: can you <b>see</b> it, or do you <b>work it out</b>?", buckets: ["I can see it", "I work it out"], cards: [["Muddy boots", 0], ["A medal", 0], ["They won", 1], ["They are happy", 1]] } } }
      ] },

    /* ---------- chunk 2: adverts and posters ---------- */
    { type: "learn", topic: "Adverts and posters", title: "Adverts suggest what they cannot say",
      fig: SHOE,
      ez: { title: "Adverts show, not say", html: "<p>Adverts <b>show</b> things. They do not say them.</p><p>Lightning and a gold 1. So these trainers are fast!</p>" },
      html: "<p>Adverts rarely say \"buy this and you will be a winner\". They could not prove it. So they <b>show</b> it, and let you work it out.</p>" +
        "<p>Look at this one. Lightning lines, a podium with a gold 1, and \"Leave them behind.\" It never says the trainers make you faster. But it <b>implies</b> it.</p>" +
        "<p>Clues to look for: <b>colours</b> (green for natural, gold for winning), <b>settings</b>, <b>the people</b> and how they look, <b>symbols</b>, and <b>slogans</b> with a double meaning.</p>" +
        "<p>Hidden depths: ask <b>why</b> they imply instead of saying. Usually it is because the claim could not be proved, and an idea you work out yourself feels more convincing.</p>",
      lv: { mild: { html: "<p>Adverts do not always say things. They <b>show</b> them.</p>" +
        "<p>This advert never says \"these trainers make you fast\". But the lightning and the gold 1 make you think it.</p>" +
        "<p>Look at the <b>pictures</b>, the <b>colours</b> and the <b>words</b>.</p>" } } },

    { type: "mc", topic: "Adverts and posters",
      q: "What is the AIRZ advert suggesting, without saying it?",
      fig: SHOE,
      options: ["Wearing these trainers will make you faster than everyone else, like a winner", "The trainers are on sale this week", "The trainers are waterproof", "Running is dangerous in a storm"],
      answer: 0,
      ez: { q: "What does the AIRZ advert want you to think?", why: "<b>They make you fast</b>. Look at the lightning.", slips: { 1: "There is no price at all.", 2: "Lightning means speed, not sleep." } },
      slips: { 1: "There is no price or sale in the advert.", 2: "Nothing shows water or rain. Look at the podium.", 3: "The lightning is about speed, not weather." },
      hint: "Look at the podium, the lightning and the slogan together.",
      why: "Speed lines, a gold 1 and \"Leave them behind\" together imply: wear these and you will beat everyone.",
      lv: { mild: { q: "What does the AIRZ advert want you to think about the trainers?", fig: SHOE,
        options: ["They make you fast", "They are cheap", "They are for sleeping in"],
        slips: { 1: "There is no price at all.", 2: "Lightning is about speed, not sleep." },
        hint: "Look at the lightning.", why: "The lightning and the gold 1 make you think they make you fast." } },
      vary: [
        { q: "What is the PURE juice advert suggesting, without saying it?", fig: JUICE,
          options: ["The juice is natural, fresh and healthy, as clean as the mountains", "The juice was made on a mountain", "The juice is cheaper than other juices", "The juice is only for mountain climbers"],
          answer: 0,
          ez: { q: "What does the PURE advert want you to think?", hint: "Look at the snow and leaves.", why: "Snow, water, leaves. It seems <b>fresh</b>.", slips: { 1: "Nothing shows fizz. Look at the leaves.", 2: "Fresh snow means fresh, not old." } },
          slips: { 1: "Taken literally, maybe, but the advert wants you to feel something: fresh and natural.", 2: "No price is shown anywhere.", 3: "The mountains are a feeling, not who it is for." },
          hint: "What do snowy mountains, waterfalls and green leaves make you think of?",
          why: "Clean snow, fresh water, green leaves and the word PURE imply natural and healthy. It never actually claims it is healthy.",
          lv: { mild: { q: "What does the PURE advert want you to think about the juice?", fig: JUICE,
            options: ["It is fresh and natural", "It is fizzy", "It is old"],
            slips: { 1: "Nothing shows fizz. Look at the mountains and the leaves.", 2: "Fresh snow and water suggest new and fresh, not old." },
            hint: "Look at the snow, water and leaves.", why: "Mountains, water and leaves make it seem fresh and natural." } } },
        { q: "What is the NOVA phone advert suggesting, without saying it?", fig: PHONEAD,
          options: ["If you have this phone, you will have lots of friends and be part of the fun", "The phone has a really good camera", "The phone comes with six free cases", "Using phones makes you lonely"],
          answer: 0,
          ez: { q: "What does the NOVA advert want you to think?", why: "Smiling friends. It means <b>fun</b>.", slips: { 1: "Nothing about weight. Look at the faces.", 2: "Everyone is smiling. Think fun." } },
          slips: { 1: "It might, but nothing in the advert shows a camera. Look at the people.", 2: "The circles are smiling faces, not phone cases.", 3: "The advert shows the opposite: lots of happy friends." },
          hint: "Who is around the phone, and how do they look?",
          why: "Smiling friends and confetti around the phone, plus \"Never miss a moment\", imply: get this phone or you will miss out.",
          lv: { mild: { q: "What does the NOVA advert want you to think?", fig: PHONEAD,
            options: ["The phone means lots of friends and fun", "The phone is heavy", "The phone is boring"],
            slips: { 1: "Nothing about weight. Look at the faces.", 2: "Everyone is smiling. It wants you to think fun." },
            hint: "Look at the faces.", why: "Smiling friends all round suggest the phone means friends and fun." } } }
      ] },

    { type: "mc", topic: "Adverts and posters", explain: true,
      q: "Why does the AIRZ advert <b>imply</b> the trainers make you a winner, instead of just saying \"These trainers make you faster\"?",
      fig: SHOE,
      options: ["Saying it straight out could not be proved, but an idea you work out yourself feels true and is hard to argue with", "Because adverts are not allowed to use words", "Because nobody wants to be faster", "Because they ran out of space"],
      answer: 0,
      ez: { q: "Does the advert <b>say</b> the trainers make you fast?", why: "<b>No</b>. It shows it with pictures.", slips: { 1: "The words are AIRZ and Leave them behind.", 2: "There are no words on the shoe." } },
      slips: { 1: "The advert does use words: the name and a slogan.", 2: "The whole advert relies on people wanting to win.", 3: "There is plenty of room. It is a choice." },
      hint: "Could the company prove the trainers make you faster?",
      why: "A stated claim can be checked and challenged. A suggestion lets your own imagination do the selling.",
      lv: { mild: { q: "Does the AIRZ advert actually <b>say</b> the trainers make you faster?", fig: SHOE,
        options: ["No: it shows it with pictures", "Yes, in big letters", "Yes, on the shoe"], fixed: true,
        slips: { 1: "Look again: the words are AIRZ and Leave them behind.", 2: "There are no words on the shoe." },
        hint: "Read the words on the advert.", why: "It never says it. It shows it, and lets you think it." } },
      vary: [
        { q: "The PURE advert says \"Taste the mountains\" instead of \"This juice is healthy\". Why might they choose to suggest it?",
          fig: JUICE,
          options: ["The juice might be full of sugar, so they cannot claim it is healthy, but mountains make it feel healthy anyway", "Because the juice tastes of rocks", "Because healthy is a rude word", "Because the company is based on a mountain"],
          answer: 0,
          ez: { q: "Does the advert <b>say</b> the juice is healthy?", why: "<b>No</b>. The pictures make you think it.", slips: { 1: "The words are Taste the mountains and PURE.", 2: "The bottle says PURE, not healthy." } },
          slips: { 1: "Taken literally that would be odd. The slogan is about a feeling.", 2: "Healthy is a fine word. The issue is proving it.", 3: "We are not told where the company is. Look at why the image is chosen." },
          hint: "What if the juice is not actually that healthy?",
          why: "Implying lets an advert give a feeling it could never claim. Hidden depths: spotting that gap is the skill.",
          lv: { mild: { q: "Does the PURE advert actually <b>say</b> the juice is healthy?", fig: JUICE,
            options: ["No: it shows it with mountains and leaves", "Yes, in big letters", "Yes, on the bottle"], fixed: true,
            slips: { 1: "Look again: the words are Taste the mountains and PURE.", 2: "The bottle says PURE, not healthy." },
            hint: "Read the words.", why: "It never says healthy. The pictures make you think it." } } },
        { q: "What is the poster suggesting, and who is it really talking to?",
          fig: BOTTLE,
          options: ["Litter you drop ends up in the sea and harms wildlife, so the reader is partly to blame and should change", "Fish like living in bottles", "Bottles are a good home for sea life", "The sea is a nice place for a holiday"],
          answer: 0,
          ez: { q: "What does the poster want you to do?", hint: "Is the fish happy?", why: "<b>Not drop bottles</b>. Litter hurts fish.", slips: { 1: "The fish is trapped. It is not selling bottles.", 2: "It is about rubbish, not fishing." } },
          slips: { 1: "The fish is trapped, not cosy. Look at the words \"Your bottle\".", 2: "\"Their home\" is said with irony: the sea is their home, and your bottle is in it.", 3: "Nothing here is about holidays." },
          hint: "Read \"Your bottle. Their home.\" Who is \"your\"?",
          why: "\"Your\" points at the reader. The trapped fish suggests harm without showing anything gory. The message: your rubbish, their problem.",
          lv: { mild: { q: "Look at the poster. What does it want you to do?", fig: BOTTLE,
            options: ["Not drop plastic bottles", "Buy more bottles", "Go fishing"],
            slips: { 1: "The fish is trapped. It is not an advert for bottles.", 2: "It is about rubbish, not fishing." },
            hint: "Is the fish happy in the bottle?", why: "The trapped fish suggests litter harms sea life. Do not drop bottles." } } }
      ] },

    { type: "mc", topic: "Adverts and posters",
      q: "In the NOVA advert, which detail does the most to suggest \"you will be left out without this phone\"?",
      fig: PHONEAD,
      options: ["The slogan \"Never miss a moment\" with the happy group all around the phone", "The phone screen is blue", "The phone has rounded corners", "The background is pink"],
      answer: 0,
      ez: { q: "What shows the phone is about friends?", why: "The <b>smiling faces</b> all round it." },
      slips: { 1: "Blue is just the screen colour. It does not suggest being left out.", 2: "Rounded corners do not suggest anything about friends.", 3: "The pink is the background. The message comes from the people and the slogan." },
      hint: "Which detail is about people and missing out?",
      why: "\"Never miss\" plays on the fear of missing out, and the crowd of friends shows what you would miss.",
      lv: { mild: { q: "In the NOVA advert, what shows the phone is about friends?", fig: PHONEAD,
        options: ["The smiling faces all round it", "The colour of the screen", "The pink background"],
        slips: { 1: "The screen colour does not show friends.", 2: "The background does not show friends." },
        hint: "Look for people.", why: "The smiling faces all round the phone." } },
      vary: [
        { q: "In the AIRZ advert, which detail does the most to suggest \"you will beat other people\"?", fig: SHOE,
          options: ["The podium with the gold 1, and the slogan \"Leave them behind\"", "The trainer is white", "The background is dark", "The laces are crossed"],
          answer: 0,
          ez: { q: "What shows winning?", why: "The <b>gold 1</b> shows winning." },
          slips: { 1: "White is just the colour of the shoe.", 2: "The dark background makes it stand out, but does not suggest beating anyone.", 3: "Laces are just laces here." },
          hint: "Which detail is about other people coming second?",
          why: "A podium means a race with losers. \"Them\" in the slogan means the other runners. Together: you beat them.",
          lv: { mild: { q: "In the AIRZ advert, what shows winning?", fig: SHOE,
            options: ["The gold number 1", "The dark background", "The laces"],
            slips: { 1: "The background does not show winning.", 2: "Laces do not show winning." },
            hint: "Look for a number.", why: "The gold 1 shows winning." } } },
        { q: "On the poster, which detail does the most to make the reader feel responsible?", fig: BOTTLE,
          options: ["The word \"Your\" in \"Your bottle\"", "The sand at the bottom", "The bubbles", "The red bottle top"],
          answer: 0,
          ez: { q: "Which word talks to you?", why: "<b>Your</b> means you." },
          slips: { 1: "The sand sets the scene. It does not point at the reader.", 2: "Bubbles show it is underwater, not who is to blame.", 3: "The red top makes it a real bottle, but \"Your\" is what points at you." },
          hint: "Which word talks straight to you?",
          why: "\"Your\" speaks directly to the reader. It suggests the bottle in the sea could be yours.",
          lv: { mild: { q: "On the poster, which word talks to you?", fig: BOTTLE,
            options: ["Your", "Their", "Home"],
            slips: { 1: "Their means the fish.", 2: "Home is the sea." },
            hint: "Which word means you?", why: "\"Your\" means you. The poster is talking to you." } } }
      ] },

    /* ---------- chunk 3: texts ---------- */
    { type: "learn", topic: "Texts suggest things", title: "Writers leave clues too",
      ez: { title: "Writers leave clues", html: "<p>Writers give <b>clues</b> about feelings.</p><p>\"[[Who]] checked the clock again.\" They are fed up waiting!</p>" },
      html: "<p>Writers do the same as pictures. They do not always tell you how someone feels. They give you clues:</p>" +
        "<p><b>What people do:</b> \"[[Who]] tapped their foot and checked the clock again.\" (impatient, waiting)<br><b>How they say it:</b> \"'Lovely,' she said, without looking up.\" (not really interested)<br><b>Word choice:</b> \"The fridge held one lonely lemon.\" (not much food in)</p>" +
        "<p>Hidden depths: watch for <b>tone</b> too. \"Oh brilliant, another Monday\" says brilliant, but means the opposite. That is <b>sarcasm</b>.</p>",
      fig: svg(520, 170, "A clue in a text leads to an idea: checked their phone four times leads to worried",
        '<rect width="520" height="170" rx="16" fill="#eef3fb"/>' +
        '<rect x="20" y="40" width="230" height="80" rx="12" fill="#ffffff" stroke="#141a33" stroke-width="2"/>' + T(34, 70, "\"tapped their foot and", 14) + T(34, 92, "checked the clock again\"", 14) +
        '<path d="M262 80h50l-8 -7M312 80l-8 7" stroke="#141a33" stroke-width="3" fill="none"/>' +
        '<rect x="326" y="40" width="174" height="80" rx="12" fill="#9be3c6" stroke="#141a33" stroke-width="2"/>' + T(413, 72, "impatient,", 14, { a: "middle", b: 1 }) + T(413, 94, "waiting", 14, { a: "middle", b: 1 }) +
        T(135, 146, "what the writer shows", 12, { a: "middle" }) + T(413, 146, "what you work out", 12, { a: "middle" }) +
        A.egg(A.bird(486, 26, 0.5, "#8a5cf6"), "This bird keeps checking the feeder. You can infer it is hungry. Jay would top it up.")),
      lv: { mild: { html: "<p>Writers do not always say how someone feels. They give clues.</p>" +
        "<p>\"[[Who]] tapped their foot and checked the clock again.\" They do not say fed up with waiting, but you can tell.</p>" +
        "<p>\"'Lovely,' she said, without looking up.\" Does she really think it is lovely? Probably not.</p>" } } },

    { type: "mc", topic: "Texts suggest things",
      q: "\"[[Who]] checked their phone for the fourth time. Still nothing. 'I'm fine,' they said, a bit too quickly.\" What does this suggest?",
      options: ["They are waiting anxiously for news and are not really fine, but do not want anyone to know", "They are totally fine and relaxed", "Their phone has run out of battery", "They are bored of their phone"],
      answer: 0,
      ez: { hint: "Why check 4 times?", why: "<b>Probably not</b>. They seem worried.", slips: { 1: "Too quickly is a clue they are not.", 2: "They are talking, so they are awake." } },
      slips: { 1: "They say they are fine, but \"a bit too quickly\" suggests they are covering it up.", 2: "\"Still nothing\" means no message has come, not that the phone is dead.", 3: "You do not check something four times if you are bored of it." },
      hint: "Why check four times? Why say it \"a bit too quickly\"?",
      why: "Checking again and again suggests waiting for something important. Saying \"I'm fine\" too quickly suggests hiding how they feel.",
      lv: { mild: { q: "\"[[Who]] checked their phone for the fourth time. 'I'm fine,' they said, a bit too quickly.\" Are they really fine?",
        options: ["Probably not: they seem worried", "Yes, totally fine", "They are asleep"],
        slips: { 1: "\"A bit too quickly\" is a clue they are not.", 2: "They are checking a phone and talking, so they are awake." },
        hint: "Why check four times?", why: "Checking four times and answering too quickly suggest they are worried." } },
      vary: [
        { q: "\"When [[who]] walked in, the table went quiet. Two people slid their bags onto the empty seats.\" What does this suggest?",
          options: ["The people at the table do not want [[who]] to sit with them", "The table is being polite and saving seats for [[who]]", "The people are tired and need a rest", "[[Who]] is late for a meeting"],
          answer: 0,
          ez: { why: "<b>No</b>. Bags on seats block them.", slips: { 1: "Bags on seats stop anyone sitting.", 2: "They did it as [[who]] walked in." } },
          slips: { 1: "Putting bags on the empty seats blocks them. That is the opposite of saving them.", 2: "Going quiet when one person walks in is about that person, not tiredness.", 3: "Nothing mentions time or a meeting." },
          hint: "Why put bags on empty seats just as someone arrives?",
          why: "Going quiet and blocking the seats suggest a cold welcome. Nobody says \"go away\", but the actions do.",
          lv: { mild: { q: "\"When [[who]] walked in, two people put their bags on the empty seats.\" Do they want [[who]] to sit there?",
            options: ["No", "Yes", "They do not see [[who]]"],
            slips: { 1: "Bags on seats stop anyone sitting there.", 2: "They did it just as [[who]] walked in, so they did see." },
            hint: "What do bags on seats do?", why: "Putting bags on seats blocks them. They do not want [[who]] to sit there." } } },
        { q: "\"Oh brilliant,\" muttered [[who]], looking at the rain. \"Just what I needed.\" What does this suggest?",
          options: ["They are annoyed: they are being sarcastic and mean the opposite", "They are really pleased about the rain", "They needed some water", "They are talking about a brilliant idea"],
          answer: 0,
          ez: { hint: "How does muttering sound?", why: "<b>No</b>. They say brilliant but mean the opposite." },
          slips: { 1: "\"Muttered\" is a grumpy way of speaking. The words say pleased but the tone says the opposite.", 2: "Taken literally, maybe, but people rarely mutter when they are pleased.", 3: "They are looking at the rain when they say it." },
          hint: "How do people sound when they mutter?",
          why: "Positive words said in a muttered, grumpy way suggest sarcasm. The real meaning is the opposite of the words.",
          lv: { mild: { q: "\"Oh brilliant,\" muttered [[who]], looking at the rain. Are they really happy?",
            options: ["No, they are fed up", "Yes, very happy", "They love rain"],
            slips: { 1: "\"Muttered\" is a grumpy word.", 2: "People do not mutter about things they love." },
            hint: "How do people sound when they mutter?", why: "They say brilliant, but they mean the opposite. They are fed up." } } }
      ] },

    { type: "text", topic: "Texts suggest things",
      q: "\"'I'm fine,' they said, a bit too quickly.\" What does \"a bit too quickly\" suggest? Write your idea.",
      need: [["not", "lying", "hid", "pretend", "upset", "worr", "isn't", "isnt", "fake", "cover", "nervous", "sad", "scared", "anxious", "really"]],
      slips: [[["fast", "quick", "speed"], "That is what it says. What does saying it too fast suggest about how they really feel?"]],
      ez: { hint: "Why rush to say fine?", why: "Too fast means they are <b>not fine</b>.", slips: [[null, "That is what it says. How do they really feel?"]] },
      model: "It suggests they are not really fine and are hiding how they feel.",
      hint: "Why might someone rush to say they are fine?",
      why: "Answering too fast suggests the words are a cover. They are probably not fine.",
      lv: { mild: { q: "\"'I'm fine,' they said, a bit too quickly.\" Finish: \"I think they are really...\"", model: "I think they are really upset and not fine." } },
      vary: [
        { q: "\"The house had seen better days.\" What does this suggest about the house? Write your idea.",
          need: [["old", "run down", "rundown", "broken", "falling", "tatty", "shabby", "damag", "worn", "bad", "messy", "crumbl", "scruffy", "neglect", "dirty", "repair"]],
          slips: [[["days", "seen"], "Houses cannot really see. What does the phrase suggest about how it looks now?"]],
          ez: { hint: "Better or worse now?", why: "It means the house is <b>old and run down</b>.", slips: [[null, "Houses cannot see. How does it look now?"]] },
          model: "It suggests the house is old and run down now.",
          hint: "If it has seen better days, are things better or worse now?",
          why: "\"Seen better days\" suggests it used to be nice and is now old and run down, without saying so directly.",
          lv: { mild: { q: "\"The house had seen better days.\" Finish: \"I think the house is...\"", model: "I think the house is old and broken." } } },
        { q: "Jay writes: \"Bonnie was a delight on the walk today, apart from the incident with the duck.\" What does \"the incident with the duck\" suggest? Write your idea.",
          need: [["chase", "bark", "ran", "run", "naughty", "trouble", "jump", "attack", "fight", "misbehav", "wrong", "bad", "pull", "scare", "went after", "mess"]],
          slips: [[["delight", "nice", "good walk"], "That is the part Jay says. What is he not saying about the duck?"]],
          ez: { hint: "Incident means something went wrong.", why: "Bonnie was naughty. <b>Probably a chase</b>! The duck is fine.", slips: [[null, "Jay says that part. What about the duck?"]] },
          model: "It suggests Bonnie misbehaved, maybe she chased or barked at the duck.",
          hint: "\"Incident\" is a word for something that went wrong.",
          why: "\"Incident\" suggests something went wrong, and Jay does not want to say exactly what. Probably a chase. The duck is fine.",
          lv: { mild: { q: "Jay writes: \"Bonnie was good, apart from the incident with the duck.\" Finish: \"I think Bonnie...\"", model: "I think Bonnie chased the duck." } } }
      ] },

    { type: "mc", topic: "Texts suggest things",
      q: "\"[[Who]] stood outside [[place]] for a long time, hand on the door, before finally pushing it open.\" Which inference fits <b>all</b> the clues best?",
      options: ["They were nervous or unsure about going in, and had to build up courage", "They had forgotten how doors work", "They were in a big hurry to get inside", "They were waiting for a bus"],
      answer: 0,
      slips: { 1: "A funny reading, but \"finally\" suggests a decision, not confusion.", 2: "\"A long time\" is the opposite of a hurry.", 3: "Their hand is on the door. They are thinking about going in." },
      hint: "Look at \"a long time\" and \"finally\".",
      why: "\"A long time\" and \"finally\" suggest hesitation. Hidden depths: it could be fear or excitement, but either way they had to build up to it.",
      lv: { mild: { q: "\"[[Who]] stood outside the door for a long time before going in.\" How might they feel?",
        options: ["Nervous", "In a rush", "Sleepy"],
        slips: { 1: "Waiting a long time is the opposite of a rush.", 2: "Standing outside a door does not suggest sleepy." },
        hint: "Why wait a long time?", why: "Waiting a long time before going in suggests they were nervous." } },
      vary: [
        { q: "\"Back in [[place]], [[who]] smiled for the cameras. Under the table, their knee would not stop bouncing.\" Which inference fits <b>all</b> the clues best?",
          options: ["They are trying to look calm, but are secretly very nervous", "They are completely relaxed", "Their knee is injured", "They are dancing to music"],
          answer: 0,
          slips: { 1: "The bouncing knee is the clue they are not.", 2: "A bouncing knee is usually nerves, not an injury.", 3: "It is under the table, hidden. That suggests nerves they want to hide." },
          hint: "What does the smile show? What does the hidden knee show?",
          why: "The smile is what they show. The bouncing knee, hidden under the table, is what they feel. The contrast suggests hidden nerves.",
          lv: { mild: { q: "\"[[Who]] smiled. Under the table, their knee would not stop bouncing.\" How do they really feel?",
            options: ["Nervous", "Sleepy", "Bored"],
            slips: { 1: "A bouncing knee is not sleepy.", 2: "A bouncing knee usually means nerves." },
            hint: "What does a bouncing knee often mean?", why: "The bouncing knee suggests they are nervous, even though they smile." } } },
        { q: "\"Everyone had signed the leaving card for [[who]]. The space under 'Good luck!' stayed empty.\" Which inference fits <b>all</b> the clues best?",
          options: ["Nobody felt they could honestly write good luck, so maybe [[who]] was not popular or was leaving on bad terms", "Everyone forgot how to write", "The card was too small", "[[Who]] wrote the card themselves"],
          answer: 0,
          slips: { 1: "Everyone signed it, so they can write. The gap is a choice.", 2: "The space is there. It just stayed empty.", 3: "Nothing suggests that. Everyone else signed it." },
          hint: "Everyone signed, but nobody wrote under good luck. Why?",
          why: "Signing but not wishing good luck suggests something is off between them. The empty space says it without words.",
          lv: { mild: { q: "\"Everyone signed the card, but nobody wrote under 'Good luck!'\" What might this mean?",
            options: ["People were not that sad they were going", "Everyone loved them", "The pens ran out"],
            slips: { 1: "If everyone loved them, they would write good luck.", 2: "They had pens to sign it." },
            hint: "Why leave good luck empty?", why: "Leaving it empty suggests people were not that sad they were going." } } }
      ] },

    /* ---------- chunk 4: back it up ---------- */
    { type: "learn", topic: "Back it up", title: "Make the point, prove it",
      fig: SSB,
      ez: { title: "Clue, idea, because", html: "<p>A good comment has <b>3 parts</b>.</p><p class=\"a2task\"><b>I can see</b> ONE WAY.<br><b>This suggests</b> they are leaving,<br><b>because</b> one way means no coming back.</p>" },
      html: "<p>A strong comment on implied meaning has three parts.</p>" +
        "<p class=\"a2task\">Worked example, on the suitcase picture.<br><b>I can see</b> a ticket that says ONE WAY on a packed suitcase.<br><b>This suggests</b> the person is leaving for good, not just for a trip,<br><b>because</b> a one way ticket only takes you there, not back home.<br><b>It could also suggest</b> they feel sad about it, as the photo is face down, as if it hurts to look at.</p>" +
        "<p>Next, some parts are filled in for you. Then you try a whole one, whenever you fancy it.</p>",
      lv: {
        mild: { html: "<p>A good comment has three parts.</p>" +
          "<p class=\"a2task\"><b>I can see</b> a ticket that says ONE WAY.<br><b>This suggests</b> they are leaving for good,<br><b>because</b> one way means you do not come back.</p>" +
          "<p>Next you fill in one part. Then you try a whole one.</p>" },
        medium: { html: "<p>A strong comment has three parts.</p>" +
          "<p class=\"a2task\"><b>I can see</b> a ticket that says ONE WAY on a packed suitcase.<br><b>This suggests</b> the person is leaving for good,<br><b>because</b> a one way ticket does not bring you back.</p>" +
          "<p>Next, some parts are filled in for you. Then you try a whole one.</p>" } } },

    { type: "text", topic: "Back it up",
      q: "Two parts are done. Have a go at the <b>because</b>.<br><b>I can see</b> the message says Seen 3:02, and it is now 4:41. <b>This suggests</b> the friend is ignoring them, <b>because</b>...",
      fig: SEEN,
      need: [["read", "seen", "saw", "time", "hour", "ages", "long", "no reply", "not repl", "reply", "answer", "nothing", "late"]],
      slips: [[["sad", "upset"], "That is a feeling. The because links the clue to the idea: why does Seen plus the time suggest ignoring?"]],
      ez: { q: "Finish it.<br><b>I can see</b> Seen, but no reply.<br><b>This suggests</b> they are ignoring them,<br><b>because</b>...", hint: "What does Seen mean?", why: "They read it ages ago. Still <b>no answer</b>.", slips: [[null, "That is a feeling. Why does Seen suggest ignoring?"]] },
      model: "because they read it over an hour ago and still have not replied.",
      hint: "What does Seen mean? How long ago was 3:02?",
      why: "The because links clue to idea: they have read it, plenty of time has passed, and there is still no answer.",
      lv: { mild: { q: "Finish it. <b>I can see</b> it says Seen, with no reply. <b>This suggests</b> the friend is ignoring them, <b>because</b>...", model: "because they saw it but did not reply." } },
      vary: [
        { q: "Two parts are done. Have a go at the <b>because</b>.<br><b>I can see</b> a medal that says 1st hanging on the hook. <b>This suggests</b> the team won the match, <b>because</b>...",
          fig: BOOTS,
          need: [["first", "1st", "win", "won", "top", "best", "place", "medal", "trophy", "beat"]],
          slips: [[["happy", "proud"], "That is a feeling. The because explains why the medal suggests winning."]],
          ez: { q: "Finish it.<br><b>I can see</b> a 1st medal.<br><b>This suggests</b> they won,<br><b>because</b>...", why: "<b>1st</b> means first place.", slips: [[null, "That is a feeling. Why does 1st mean winning?"]] },
          model: "because 1st means they came first, which means they won.",
          hint: "What does 1st mean?",
          why: "1st means first place. That link is the because.",
          lv: { mild: { q: "Finish it. <b>I can see</b> a 1st medal. <b>This suggests</b> they won, <b>because</b>...", model: "because 1st means first place." } } },
        { q: "Two parts are done. Have a go at the <b>because</b>.<br><b>I can see</b> the word \"Your\" in \"Your bottle\". <b>This suggests</b> the reader is to blame for the litter, <b>because</b>...",
          fig: BOTTLE,
          need: [["you", "reader", "me", "talk", "speak", "point", "direct", "own", "belong", "drop", "personal"]],
          slips: [[["fish", "sea"], "That describes the picture. The because explains why the word \"Your\" points at the reader."]],
          ez: { q: "Finish it.<br><b>I can see</b> the word \"Your\".<br><b>This suggests</b> it is about me,<br><b>because</b>...", hint: "Who is your?", why: "<b>Your</b> talks straight to you.", slips: [[null, "That is the picture. Why does Your mean you?"]] },
          model: "because \"Your\" talks directly to the reader, as if the bottle belongs to them.",
          hint: "Who is \"your\"?",
          why: "\"Your\" speaks straight to the reader, so the bottle becomes theirs. That is the link.",
          lv: { mild: { q: "Finish it. <b>I can see</b> the word \"Your\". <b>This suggests</b> it is about me, <b>because</b>...", model: "because Your means you." } } }
      ] },

    { type: "text", topic: "Back it up",
      q: "Now just the clue is done. Write what it <b>suggests</b> and <b>because</b>.<br><b>I can see</b> the advert puts the juice in front of snowy mountains and a waterfall. <b>This suggests</b>...",
      fig: JUICE,
      need: [["fresh", "natural", "healthy", "pure", "clean", "good for", "cold", "nature"], ["because", "as", "since", "so", "mountain", "snow", "water", "nature"]],
      slips: [[["mountain juice", "made on"], "Think about the feeling, not the literal place. What do mountains and waterfalls make you think of?"]],
      ez: { q: "<b>I can see</b> snowy mountains behind the juice.<br>Finish: \"This suggests the juice is...\"", hint: "What do mountains feel like?", why: "Clean mountains make the juice feel <b>fresh</b>.", slips: [[null, "Think of a feeling. What do mountains make you think?"]] },
      model: "This suggests the juice is fresh and natural, because snowy mountains and waterfalls make you think of clean, pure nature.",
      hint: "Suggests: what kind of drink? Because: what do mountains and waterfalls feel like?",
      why: "Clean nature makes the drink feel clean. The because says how the image creates that idea.",
      lv: { mild: { q: "<b>I can see</b> snowy mountains and a waterfall behind the juice. Finish: \"This suggests the juice is...\"", fig: JUICE,
        need: [["fresh", "natural", "healthy", "pure", "clean", "good", "cold", "nature", "nice"]],
        model: "This suggests the juice is fresh and natural." } },
      vary: [
        { q: "Now just the clue is done. Write what it <b>suggests</b> and <b>because</b>.<br><b>I can see</b> the photo on the shelf is face down. <b>This suggests</b>...",
          fig: LEAVE,
          need: [["sad", "upset", "hurt", "miss", "angry", "fall", "argu", "break", "bad", "do not want", "don't want", "dont want", "painful", "memor", "forget"], ["because", "as", "since", "so", "look", "see", "face", "remind"]],
          slips: [[["fell", "knocked"], "It might have fallen. But in a picture full of leaving clues, what else could it suggest?"]],
          ez: { q: "<b>I can see</b> the photo is face down.<br>Finish: \"This suggests they...\"", hint: "Why turn a photo face down?", why: "It hurts to look. It is a <b>sad goodbye</b>.", slips: [[null, "It might have fallen. What else could it mean?"]] },
          model: "This suggests they feel sad about someone in the photo, because turning it face down means they do not want to look at it.",
          hint: "Why might you turn a photo face down?",
          why: "Turning a photo away suggests it hurts to look at. Alongside the packed case, it hints at a painful goodbye.",
          lv: { mild: { q: "<b>I can see</b> the photo is face down. Finish: \"This suggests they...\"", fig: LEAVE,
            need: [["sad", "upset", "miss", "angry", "do not want", "don't want", "dont want", "hurt", "cross"]],
            model: "This suggests they are sad and do not want to look at it." } } },
        { q: "Now just the clue is done. Write what it <b>suggests</b> and <b>because</b>.<br><b>I can see</b> six smiling friends all around the NOVA phone. <b>This suggests</b>...",
          fig: PHONEAD,
          need: [["friend", "popular", "fun", "fit in", "included", "happy", "social", "left out", "miss out"], ["because", "as", "since", "so", "around", "smil", "everyone", "group"]],
          slips: [[["six people", "faces"], "That is what you can see. What does it suggest about owning the phone?"]],
          ez: { q: "<b>I can see</b> smiling friends around the phone.<br>Finish: \"This suggests the phone...\"", hint: "What do you get with the phone?", why: "Happy friends round it. The phone means <b>friends</b>.", slips: [[null, "That is what you see. What does it suggest?"]] },
          model: "This suggests the phone will make you popular and part of the fun, because everyone around it is smiling together.",
          hint: "What do you get if you have the phone, according to the picture?",
          why: "Putting happy friends around the phone links the phone with friendship. The because shows how the image does it.",
          lv: { mild: { q: "<b>I can see</b> smiling friends around the phone. Finish: \"This suggests the phone...\"", fig: PHONEAD,
            need: [["friend", "fun", "happy", "popular", "people", "smile", "good"]],
            model: "This suggests the phone means fun with friends." } } }
      ] },

    { type: "mc", topic: "Back it up", explain: true,
      q: "Which comment on the poster is strongest?",
      fig: BOTTLE,
      options: ["The fish is trapped inside a bottle, which suggests plastic litter harms sea life, because the sea is the fish's home and our rubbish has invaded it.", "There is a fish and a bottle.", "The poster is about the sea and it is really good.", "This suggests litter is bad."],
      answer: 0,
      ez: { hint: "Which one says what it suggests?", why: "It gives the <b>clue</b> and what it <b>suggests</b>." },
      slips: { 1: "That is what you can see. Add what it suggests and why.", 2: "\"Really good\" is an opinion about the poster, not a comment on its meaning.", 3: "A good idea, but there is no evidence or because. Point to the clue." },
      hint: "Look for clue, suggests and because, all in one.",
      why: "The strongest comment has all three: the clue (trapped fish), the idea (litter harms sea life) and the link (it is their home).",
      lv: { mild: { q: "Which comment on the poster is best?", fig: BOTTLE,
        options: ["The fish is stuck in the bottle, so it suggests litter hurts fish.", "There is a fish.", "It is nice."],
        slips: { 1: "True, but what does it suggest?", 2: "Nice how? Say what it suggests." },
        hint: "Find the one that says what it suggests.", why: "It says the clue and what it suggests." } },
      vary: [
        { q: "Which comment on the AIRZ advert is strongest?", fig: SHOE,
          options: ["The gold podium suggests wearing AIRZ will make you a winner, because a podium is where race winners stand.", "There is a trainer and a podium.", "The advert is cool and I would buy them.", "This suggests they are good trainers."],
          answer: 0,
          ez: { hint: "Which one says what it suggests?", why: "It gives the <b>clue</b> and what it <b>suggests</b>." },
          slips: { 1: "That is what you can see. What does it suggest?", 2: "That is your opinion of the advert, not its hidden meaning.", 3: "Good how? Point to a clue and add a because." },
          hint: "Clue, suggests, because.",
          why: "It points to a clue (podium), says the idea (winner) and explains the link (podiums are for winners).",
          lv: { mild: { q: "Which comment on the AIRZ advert is best?", fig: SHOE,
            options: ["The gold 1 suggests the trainers make you a winner.", "There is a shoe.", "It is cool."],
            slips: { 1: "True, but what does it suggest?", 2: "Cool how? Say what it suggests." },
            hint: "Find the one that says what it suggests.", why: "It says the clue and what it suggests." } } },
        { q: "\"When [[who]] walked in, two people slid their bags onto the empty seats.\" Which comment is strongest?",
          options: ["Sliding bags onto the seats suggests they do not want [[who]] to join them, because it blocks the seats just as [[who]] arrives.", "Two people moved their bags.", "This is a sad bit of the story.", "This suggests they are mean."],
          answer: 0,
          ez: { hint: "Which one says what it suggests?", why: "It gives the <b>clue</b> and what it <b>suggests</b>." },
          slips: { 1: "That retells what happens. What does it suggest?", 2: "That is your reaction. Point to the clue and say what it suggests.", 3: "A fair idea, but it needs the clue and a because." },
          hint: "Clue, suggests, because.",
          why: "It quotes the action, says the idea, and explains why the timing matters.",
          lv: { mild: { q: "\"Two people put their bags on the empty seats when [[who]] walked in.\" Which comment is best?",
            options: ["The bags on the seats suggest they do not want [[who]] there.", "There are bags.", "It is sad."],
            slips: { 1: "True, but what does it suggest?", 2: "Say what it suggests." },
            hint: "Find the one that says what it suggests.", why: "It says the clue and what it suggests." } } }
      ] }
  ],

  ez: {
    realWorld: { title: "Reading what is not said", html: "<p>You do this every day. A face. A message with no reply.</p><p>Historians do it too, with old photos.</p>" },
    make: { intro: "Pick a picture. Write the clue, the idea and why." }
  },
  realWorld: {
    title: "Reading what is not said",
    html: "<p>You do this all day: reading a friend's face, a message with no reply, an advert that wants something from you. Doing it on purpose, with evidence, is a superpower. It helps you spot when an advert is selling a feeling, and when someone might need a bit of kindness.</p>" +
      "<p>For our big question: historians are time travellers of a sort. They look at old photos and paintings and work out what life was like, from clues nobody wrote down. If we could time travel, should we? Maybe careful inference already gets us a long way there.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="Jay by the time portal holding an old photo">' + A.portal(76, 75, 56) + A.jay(240, 60, 0.85, "wow") +
      '<rect x="168" y="96" width="40" height="32" fill="#e0c48f" stroke="#141a33" stroke-width="2" transform="rotate(-8 188 112)"/>' +
      A.bubble(286, 8, 126, 52, "What does this\nold photo say?", 290) + '</svg>'
  },

  make: {
    title: "Make an inference card",
    intro: "Pick a picture, an advert or a line from something you have read or seen. Write the clue, what it suggests and why. Keep it, stick it up, or send it to Jay.",
    fields: [
      { id: "clue", label: "I can see", ph: "A bag of seeds by Jay's desk", max: 60 },
      { id: "idea", label: "This suggests", ph: "Jay is planning to feed the birds", max: 60 },
      { id: "why", label: "Because", ph: "Birds eat seeds, and he talks about birds a lot", max: 70 },
      { id: "name", label: "Inference by", ph: "B5", max: 24 }
    ],
    svg: function(v){
      function block(y, label, txt, col){
        var ls = wrap(txt, 38, 2);
        return '<rect x="30" y="' + y + '" width="400" height="80" rx="14" fill="' + col + '"/>' +
          T(46, y + 24, label, 13, { b: 1, c: "#3a4060" }) + ls.map(function(l, k){ return T(46, y + 48 + k * 22, esc(l), 17, { b: 1 }); }).join("");
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#1f3b4d"/>' +
        '<rect x="14" y="14" width="572" height="372" rx="18" fill="#fffdf6"/>' +
        T(30, 52, "WHAT IS NOT SAID", 24, { b: 1, c: "#1f7a6a" }) +
        block(70, "I CAN SEE", v.clue, "#ffe98f") + block(160, "THIS SUGGESTS", v.idea, "#b9eedb") + block(250, "BECAUSE", v.why, "#ddd3ff") +
        T(30, 366, "Inference by: " + esc(wrap(v.name, 24, 1)[0] || ""), 15, { b: 1, c: "#3a4060" }) +
        '<g transform="translate(510 170)"><path d="M-50 0q50 -46 100 0q-50 46 -100 0z" fill="#ffffff" stroke="#141a33" stroke-width="3"/><circle r="18" fill="#19c39a"/><circle r="8" fill="#141a33"/></g>' +
        '<g transform="translate(510 290)"><path d="M-44 -30h88q10 0 10 10v34q0 10 -10 10h-54l-16 14 2 -14h-20q-10 0 -10 -10v-34q0 -10 10 -10z" fill="#ffffff" stroke="#141a33" stroke-width="3"/>' + T(0, 2, ". . .", 20, { a: "middle", b: 1, c: "#9aa3bd" }) + '</g>' +
        '</svg>';
    }
  }
};
})();
