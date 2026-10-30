/* Base 5 Autumn 2 activity: Hot or not.
   Maths. Reading thermometers and comparing temperatures. ASCII only. */
(function(){
var A = window.A2ART;
var FONT = 'font-family="Verdana,Arial,sans-serif"';
var DEG = "&#176;C";
function T(x, y, s, size, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (size || 14) + '"' + (o.b ? ' font-weight="700"' : '') +
    (o.a ? ' text-anchor="' + o.a + '"' : '') + ' fill="' + (o.c || "#141a33") + '">' + s + '</text>';
}
function esc(t){ return String(t == null ? "" : t).replace(/[&<>]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function wrap(t, n, max){ var w = String(t || "").split(/\s+/), out = [], cur = ""; w.forEach(function(x){ if((cur + " " + x).trim().length > n && cur.trim()){ out.push(cur.trim()); cur = x; } else cur += " " + x; }); if(cur.trim()) out.push(cur.trim()); return out.slice(0, max || 3); }
function fmt(v){ return String(Math.round(v * 100) / 100); }

/* ---------- a thermometer ----------
   o: {min, max, major, minor, val, top, h, name, unit:false} */
function thermo(cx, o){
  var top = o.top || 40, H = o.h || 170, min = o.min, max = o.max;
  function y(v){ return top + (max - v) / (max - min) * H; }
  var s = '<rect x="' + (cx - 10) + '" y="' + (top - 14) + '" width="20" height="' + (H + 30) + '" rx="10" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/>';
  if(o.val != null) s += '<rect x="' + (cx - 5) + '" y="' + y(o.val) + '" width="10" height="' + (top + H + 22 - y(o.val)) + '" fill="#e04848"/>';
  s += '<circle cx="' + cx + '" cy="' + (top + H + 30) + '" r="18" fill="#e04848" stroke="#141a33" stroke-width="2.5"/>';
  if(o.val != null) s += '<rect x="' + (cx - 5) + '" y="' + (top + H + 4) + '" width="10" height="14" fill="#e04848"/>';
  var n = Math.round((max - min) / o.minor);
  for(var k = 0; k <= n; k++){
    var v = min + k * o.minor, q = (v - min) / o.major, maj = Math.abs(q - Math.round(q)) < 1e-6, yy = y(v);
    s += '<path d="M' + (cx + 10) + ' ' + yy + 'h' + (maj ? 16 : 8) + '" stroke="#141a33" stroke-width="' + (maj ? 2.5 : 1.5) + '"/>';
    if(maj) s += T(cx + 31, yy + 5, fmt(v), 13, { b: 1 });
  }
  if(o.brace) s += '<path d="M' + (cx - 16) + ' ' + y(o.brace[0]) + 'h-8V' + y(o.brace[1]) + 'h8" fill="none" stroke="#ff8a3d" stroke-width="4" stroke-linejoin="round"/>';
  if(o.unit !== false) s += T(cx, top - 22, DEG, 13, { b: 1, a: "middle", c: "#5b6180" });
  if(o.name) s += T(cx + 10, top + H + 70, o.name, 14, { b: 1, a: "middle" });
  return s;
}
function thermos(list, label, extra){
  var w = Math.max(520, 60 + list.length * 150), h = 300;
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + label + '">' +
    '<rect width="' + w + '" height="' + h + '" rx="16" fill="#f4f1ea"/>' +
    list.map(function(o, k){ return thermo(w / 2 - (list.length - 1) * 75 + k * 150 - 14, o); }).join("") + (extra || "") + '</svg>';
}
function one(min, max, major, minor, val, label){
  return thermos([{ min: min, max: max, major: major, minor: minor, val: val }], label || "A thermometer to read");
}

/* the parts of a thermometer */
var PARTS = '<svg viewBox="0 0 520 300" role="img" aria-label="A thermometer: the bulb at the bottom, red liquid that rises, and a scale of numbers">' +
  '<rect width="520" height="300" rx="16" fill="#f4f1ea"/>' +
  thermo(200, { min: 0, max: 50, major: 10, minor: 10, val: 20 }) +
  '<path d="M150 240h28" stroke="#141a33" stroke-width="2.5"/>' + T(144, 245, "Bulb", 15, { b: 1, a: "end" }) +
  '<path d="M150 146h42" stroke="#141a33" stroke-width="2.5"/>' + T(144, 140, "Top of the", 15, { b: 1, a: "end" }) + T(144, 160, "red line", 15, { b: 1, a: "end" }) +
  '<path d="M270 74h40" stroke="#141a33" stroke-width="2.5"/>' + T(318, 80, "Scale", 15, { b: 1 }) +
  '<path d="M270 146h40" stroke="#141a33" stroke-width="2.5"/>' + T(318, 140, "It reads", 15, { b: 1 }) + T(318, 162, "20" + DEG, 18, { b: 1, c: "#e04848" }) +
  A2ART.egg(A2ART.bird(470, 240, 0.7, "#3a8fd6"), "On a hot day, birds find the shade. Jay says this is very sensible bird behaviour.") +
  '</svg>';

/* worked example: thermometer and four steps */
function worked(o, lines, br){
  return '<svg viewBox="0 0 560 310" role="img" aria-label="A worked example of reading a scale with marks between the labels">' +
    '<rect width="560" height="310" rx="16" fill="#f4f1ea"/>' +
    thermo(84, { min: o.min, max: o.max, major: o.major, minor: o.minor, val: o.val, h: 200, brace: br }) +
    lines.map(function(l, k){
      var y = 46 + k * 64;
      return '<circle cx="186" cy="' + (y + 4) + '" r="14" fill="' + ["#ffd23f", "#22b8e6", "#19c39a", "#ff5d8f"][k] + '" stroke="#141a33" stroke-width="2"/>' +
        T(186, y + 9, String(k + 1), 14, { b: 1, a: "middle" }) +
        T(212, y + 2, l[0], 15, { b: 1 }) + T(212, y + 24, l[1], 15);
    }).join("") + '</svg>';
}
var WORKED = {
  mild: worked({ min: 0, max: 40, major: 10, minor: 5, val: 25 }, [["Find two labels next to", "each other: 20 and 30."], ["Count the gaps between", "them: 2 gaps."], ["Share it out: 10 / 2 = 5.", "Each gap is worth 5."], ["Count up from 20 in 5s:", "25. It reads 25" + DEG + "."]], [20, 30]),
  medium: worked({ min: 0, max: 40, major: 10, minor: 2, val: 26 }, [["Find two labels next to", "each other: 20 and 30."], ["Count the gaps between", "them: 5 gaps."], ["Share it out: 10 / 5 = 2.", "Each gap is worth 2."], ["Count up from 20 in 2s:", "22, 24, 26. It reads 26" + DEG + "."]], [20, 30]),
  spicy: worked({ min: 0, max: 50, major: 10, minor: 2.5, val: 32.5 }, [["Find two labels next to", "each other: 30 and 40."], ["Count the gaps between", "them: 4 gaps."], ["Share it out: 10 / 4 = 2.5.", "Each gap is worth 2.5."], ["Count up from 30: 32.5.", "It reads 32.5" + DEG + "."]], [30, 40])
};

/* counting up on a number line to find a difference */
function jumps(lo, hi, stops, label, even){
  function x(v){ return even ? 60 + stops.indexOf(v) * (420 / (stops.length - 1)) : 40 + (v - lo) / (hi - lo) * 460; }
  var s = '<svg viewBox="0 0 540 180" role="img" aria-label="' + label + '">' +
    '<rect width="540" height="180" rx="16" fill="#f4f1ea"/>' +
    '<path d="M30 120h480" stroke="#141a33" stroke-width="3"/>';
  stops.forEach(function(v){ s += '<path d="M' + x(v) + ' 110v20" stroke="#141a33" stroke-width="3"/>' + T(x(v), 152, fmt(v), 15, { b: 1, a: "middle" }); });
  for(var k = 1; k < stops.length; k++){
    var a = x(stops[k - 1]), b = x(stops[k]), m = (a + b) / 2;
    s += '<path d="M' + a + ' 108Q' + m + ' 40 ' + b + ' 108" fill="none" stroke="#e04848" stroke-width="3"/><path d="M' + (b - 8) + ' 98l8 10 3 -12" fill="none" stroke="#e04848" stroke-width="3"/>' +
      T(m, 64, "+" + fmt(stops[k] - stops[k - 1]), 16, { b: 1, a: "middle", c: "#e04848" });
  }
  return s + '</svg>';
}

/* temperatures worth knowing */
var REF = (function(){
  var items = [
    ["Fridge", "4", '<rect x="-16" y="-26" width="32" height="50" rx="4" fill="#e8f7ff" stroke="#141a33" stroke-width="2.5"/><path d="M-16 -6h32M10 -18v6M10 2v8" stroke="#141a33" stroke-width="2.5"/>'],
    ["Room", "20", '<path d="M-24 0l24 -24 24 24v24h-48z" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><rect x="-6" y="8" width="12" height="16" fill="#a0784a"/>'],
    ["Hot day", "30", '<circle r="14" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="M0 -26v-6M0 26v6M-26 0h-6M26 0h6M-18 -18l-5 -5M18 18l5 5M-18 18l-5 5M18 -18l5 -5" stroke="#ff8a3d" stroke-width="3" stroke-linecap="round"/>'],
    ["Body", "37", '<circle cy="-16" r="9" fill="#f0c4a0" stroke="#141a33" stroke-width="2"/><path d="M-14 22q0 -30 14 -30q14 0 14 30z" fill="#22b8e6" stroke="#141a33" stroke-width="2"/>'],
    ["Bath", "40", '<path d="M-26 -2h52v8q0 18 -18 18h-16q-18 0 -18 -18z" fill="#ffffff" stroke="#141a33" stroke-width="2.5"/><path d="M-22 4h44" stroke="#22b8e6" stroke-width="4"/><path d="M-8 -10q-4 -6 0 -12M4 -10q-4 -6 0 -12" fill="none" stroke="#5b6180" stroke-width="2"/>'],
    ["Boiling", "100", '<path d="M-20 -10h34v30h-34z" fill="#c8ccd2" stroke="#141a33" stroke-width="2.5"/><path d="M14 -4h8v12h-8" fill="none" stroke="#141a33" stroke-width="2.5"/><path d="M-10 -16q-4 -6 0 -12M2 -16q-4 -6 0 -12" fill="none" stroke="#5b6180" stroke-width="2"/>']
  ];
  return '<svg viewBox="0 0 540 190" role="img" aria-label="Temperatures worth knowing: fridge 4, room 20, hot day 30, body 37, bath 40, boiling water 100 degrees Celsius">' +
    '<rect width="540" height="190" rx="16" fill="#f4f1ea"/>' +
    items.map(function(it, k){
      var x = 50 + k * 88;
      return '<rect x="' + (x - 40) + '" y="18" width="80" height="154" rx="12" fill="#ffffff" stroke="#141a33" stroke-opacity=".3" stroke-width="2"/>' +
        '<g transform="translate(' + x + ' 64)">' + it[2] + '</g>' +
        T(x, 120, it[0], 13, { b: 1, a: "middle" }) + T(x, 152, it[1] + DEG, 17, { b: 1, a: "middle", c: "#e04848" });
    }).join("") + '</svg>';
})();

/* ---------- widget: set the thermometer ---------- */
var TARGET = { mild: { v: 30, min: 0, max: 50, major: 10, minor: 10, step: 10 }, medium: { v: 24, min: 0, max: 50, major: 10, minor: 2, step: 1 }, spicy: { v: 37.5, min: 35, max: 40, major: 1, minor: 0.5, step: 0.5 } };
function setWidget(el, api){
  var d = api.data || {};
  var t = TARGET[api.level] || TARGET.medium;
  if(typeof d.v !== "number" || d.v < t.min || d.v > t.max) d.v = t.min + (t.max - t.min) / 5;
  el.innerHTML = '<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">' +
    '<div class="tsvg" style="width:200px;max-width:100%"></div>' +
    '<div style="flex:1;min-width:200px"><p style="font-size:1.1rem">Target: <b>' + fmt(t.v) + DEG + '</b></p>' +
    '<label style="display:block;font-weight:700;margin:8px 0">Slide to set the temperature<br><input type="range" min="' + t.min + '" max="' + t.max + '" step="' + t.step + '" style="width:100%;max-width:300px;margin-top:8px"></label>' +
    '<p class="tmsg" aria-live="polite" style="font-weight:700;min-height:2.6em"></p></div></div>';
  var pic = el.querySelector(".tsvg"), inp = el.querySelector("input"), msg = el.querySelector(".tmsg");
  inp.value = d.v;
  function draw(touched){
    var v = Math.round(parseFloat(inp.value) * 100) / 100;
    pic.innerHTML = '<svg viewBox="0 0 160 300" role="img" aria-label="Thermometer showing ' + fmt(v) + ' degrees"><rect width="160" height="300" rx="16" fill="#f4f1ea"/>' +
      thermo(60, { min: t.min, max: t.max, major: t.major, minor: t.minor, val: v }) + '</svg>';
    if(touched) msg.textContent = Math.abs(v - t.v) < 1e-6 ? "Bang on. Spot on reading." : "It reads " + fmt(v) + " degrees. A little " + (v < t.v ? "higher" : "lower") + ", if you like.";
    return v;
  }
  inp.addEventListener("input", function(){
    d.v = draw(true);
    d.hit = Math.abs(d.v - t.v) < 1e-6;
    try{ api.save(); }catch(err){}
    api.done("done");
  });
  draw(false);
}

(window.A2PACKS = window.A2PACKS || {})["hot-or-not"] = {
  a2: true,
  id: "a2-hot-or-not",
  title: "Hot or not",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 20,
  line: "Read a thermometer, then work out what is hotter, what is colder, and by how much.",
  blurb: "Reading thermometers and comparing temperatures. Four short chunks, a thermometer to set yourself, and a hot or not card to make at the end.",
  note: "Reading thermometers and comparing temperatures. Four five minute chunks and a hot or not card to make at the end. Have a go whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Lukewarm", line: "Lukewarm: read the labelled numbers and spot which is hotter." },
    { id: "medium", name: "Toasty", line: "Toasty: marks in between the labels, and how much hotter." },
    { id: "spicy", name: "Scorching", line: "Scorching: tricky scales, decimals and bigger differences." }
  ],
  themes: {
    time: { name: "Time travel", w: { hot: "the desert in ancient Egypt", cold: "the ice age cave", room: "the time lab", hotS: "Desert", coldS: "Ice age", roomS: "Time lab" } },
    football: { name: "Football", w: { hot: "the summer cup pitch", cold: "the winter away ground", room: "the changing room", hotS: "Summer cup", coldS: "Away game", roomS: "Changing room" } },
    horror: { name: "Horror", w: { hot: "the boiler room", cold: "the cold spot in the corridor", room: "the night porter's office", hotS: "Boiler room", coldS: "Cold spot", roomS: "Office" } },
    fishing: { name: "Fishing", w: { hot: "the lake in August", cold: "the river in January", room: "the tackle shop", hotS: "Lake", coldS: "River", roomS: "Tackle shop" } },
    music: { name: "Music", w: { hot: "the stage under the lights", cold: "the backstage fire exit", room: "the dressing room", hotS: "Stage", coldS: "Fire exit", roomS: "Dressing room" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: thermos([{ min: 0, max: 50, major: 10, minor: 5, val: 5, name: "[[ColdS]]" }, { min: 0, max: 50, major: 10, minor: 5, val: 20, name: "[[RoomS]]" }, { min: 0, max: 50, major: 10, minor: 5, val: 40, name: "[[HotS]]" }], "Three thermometers: cold, room and hot"),
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Reading a thermometer", title: "Meet the thermometer",
      fig: PARTS,
      html: "<p>When it gets hotter, the red liquid in a thermometer goes <b>up</b>. When it gets colder, it goes <b>down</b>.</p>" +
        "<p>To read it, look at the <b>top of the red line</b> and read the number on the scale next to it.</p>" +
        "<p>Temperatures are measured in <b>degrees Celsius</b>, written " + DEG + ". This one reads 20" + DEG + ", about right for [[room]].</p>",
      ez: { title: "Meet the thermometer", html: "<p>Hotter: the red line goes <b>up</b>. Colder: it goes <b>down</b>.</p><p>Read the number at the <b>top of the red line</b>.</p>" },
      lv: { spicy: { html: "<p>When it gets hotter, the red liquid goes <b>up</b>. Read the scale level with the <b>top of the red line</b>. Temperatures are in <b>degrees Celsius</b> (" + DEG + ").</p>" +
        "<p>Scorching tip: before you read anything, <b>check the labels</b>. Scales can go up in 1s, 2s, 5s, 10s or 20s, and some do not even start at 0.</p>" } } },

    { type: "num", topic: "Reading a thermometer",
      q: "This thermometer is in [[room]]. What temperature does it show?",
      fig: one(0, 50, 10, 10, 20, "A thermometer showing a temperature on a labelled mark"),
      boxes: [{ label: "Temperature", a: 20, post: DEG }],
      slips: [[2, "That is how many marks up it is. Read the number next to the top of the red line."]],
      hint: "Put your finger on the top of the red line. Which number is next to it?",
      why: "The red line stops at the <b>20</b> label, so it reads 20" + DEG + ".",
      ez: { q: "What temperature does it show?", hint: "Find the top of the red line.", why: "It stops at <b>20</b>. So 20" + DEG + ".", slips: [[null, "That is the marks. Read the number."]] },
      lv: { medium: { fig: one(0, 50, 10, 5, 30), boxes: [{ label: "Temperature", a: 30, post: DEG }],
          slips: [[6, "That is how many marks up it is. Read the label next to the top of the red line."], [35, "Look again: the red line stops right on a label."]],
          why: "The red line stops at the <b>30</b> label, so it reads 30" + DEG + "." },
            spicy: { fig: one(0, 100, 20, 10, 60), boxes: [{ label: "Temperature", a: 60, post: DEG }],
          slips: [[3, "That is how many labels up it is. This scale goes up in 20s."], [6, "That is how many marks up it is. Read the label instead."]],
          hint: "Check the labels first: what does this scale go up in?",
          why: "This scale goes up in 20s. The red line stops at <b>60</b>, so it reads 60" + DEG + "." } } },

    { type: "mc", topic: "Reading a thermometer",
      q: "Which thermometer shows the hotter temperature?",
      fig: thermos([{ min: 0, max: 50, major: 10, minor: 10, val: 10, name: "A" }, { min: 0, max: 50, major: 10, minor: 10, val: 30, name: "B" }], "Two thermometers, A and B"),
      options: ["Thermometer A", "Thermometer B"], answer: 1, fixed: true,
      slips: { 0: "A has the shorter red line, so it is colder. Higher red line, hotter." },
      hint: "Which red line goes higher?",
      why: "B reads 30" + DEG + " and A reads 10" + DEG + ". 30 is more than 10, so B is hotter.",
      ez: { q: "Which one is hotter?", hint: "Which red line is higher?", why: "B is 30" + DEG + ". A is 10" + DEG + ". <b>B</b> is hotter.", slips: { 0: "A is lower, so it is colder." } },
      lv: { medium: { fig: thermos([{ min: 0, max: 50, major: 10, minor: 5, val: 25, name: "A" }, { min: 0, max: 50, major: 10, minor: 5, val: 35, name: "B" }], "Two thermometers, A and B"),
          why: "B reads 35" + DEG + " and A reads 25" + DEG + ". 35 is more, so B is hotter." },
            spicy: { q: "Careful: these two have different scales. Which is hotter?",
          fig: thermos([{ min: 0, max: 50, major: 10, minor: 5, val: 30, name: "A" }, { min: 0, max: 100, major: 20, minor: 10, val: 40, name: "B" }], "Two thermometers with different scales"),
          options: ["Thermometer A", "Thermometer B"], answer: 1,
          slips: { 0: "A has the higher red line, but B has a different scale. Read the numbers: A is 30, B is 40." },
          hint: "Do not trust the height. Read each number first.",
          why: "A reads 30" + DEG + ". B's scale goes up in 20s and it reads 40" + DEG + ". So B is hotter, even though its red line looks shorter." } } },

    { type: "num", topic: "Reading a thermometer",
      q: "This thermometer is in [[hot]]. What does it read?",
      fig: one(0, 50, 10, 10, 40),
      boxes: [{ label: "Temperature", a: 40, post: DEG }],
      slips: [[4, "That is how many marks up it is. Read the label next to the top of the red line."], [50, "That is the top of the scale. Look where the red line stops."]],
      hint: "Find the top of the red line, then read across.",
      why: "The red line stops at <b>40</b>. Hot!",
      ez: { q: "This is [[hot]]. What does it read?", hint: "Find the top of the red line.", why: "It stops at <b>40</b>. Hot!", slips: [[null, "That is the marks. Read the number."], [null, "That is the top. Where does red stop?"]] },
      lv: { medium: { fig: one(0, 50, 10, 5, 45), boxes: [{ label: "Temperature", a: 45, post: DEG }],
          slips: [[40, "Nearly: the red line goes one mark past 40. Each mark is 5."], [41, "Each mark here is worth 5, not 1."]],
          hint: "There is one mark between each label. What is halfway between 40 and 50?",
          why: "Halfway between 40 and 50 is <b>45</b>." },
            spicy: { fig: one(0, 60, 20, 5, 45), boxes: [{ label: "Temperature", a: 45, post: DEG }],
          slips: [[41, "Each little gap is worth 5 here, not 1."], [43, "Check the gap size: 20 shared into 4 gaps is 5 each."]],
          hint: "Labels go up in 20s. How many gaps between 40 and 60?",
          why: "4 gaps share 20, so each gap is 5. One gap above 40 is <b>45</b>." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Marks in between", title: "Reading between the labels",
      fig: WORKED.medium,
      html: "<p>Lots of thermometers have little marks <b>between</b> the labels. Here is how to read one, step by step.</p>" +
        "<p>The trick is step 3: <b>share</b> the jump between two labels by the number of gaps. Then count up.</p>",
      ez: { title: "Between the labels", html: "<p>Count the <b>gaps</b> between 2 labels.</p><p>Share the jump. Then count up.</p>" },
      lv: { mild: { fig: WORKED.mild }, spicy: { fig: WORKED.spicy, html: "<p>Here is the method, step by step. It works on any scale.</p>" +
        "<p>The trick is step 3: <b>share</b> the jump between two labels by the number of gaps. This time each gap is a decimal, 2.5. That is fine: count up in 2.5s.</p>" } } },

    { type: "num", topic: "Marks in between",
      q: "Your turn, with the steps laid out. Fill in each box.",
      fig: one(0, 40, 10, 2, 14),
      boxes: [{ label: "Gaps between 10 and 20", a: 5 }, { label: "Each gap is worth", a: 2 }, { label: "Temperature", a: 14, post: DEG }],
      slips: [[0, 4, "Count the gaps (spaces), not the little lines. There are 5 spaces."], [1, 1, "10 shared between 5 gaps is 2, not 1."], [2, 12, "Count up from 10 in 2s: 12, 14. Two gaps."]],
      hint: "Count the spaces between 10 and 20. Then share 10 between them.",
      why: "5 gaps share 10, so each gap is 2. Two gaps above 10: 12, <b>14</b>.",
      ez: { q: "Your turn. Fill in each box.", hint: "Count the spaces. Share 10.", why: "Each gap is 5. So <b>15</b>.", slips: [[null, null, "Count spaces, not lines."], [null, null, "10 shared by 2 gaps is 5."], [null, null, "Each gap is 5. So 15."]] },
      lv: { mild: { fig: one(0, 40, 10, 5, 15), boxes: [{ label: "Gaps between 10 and 20", a: 2 }, { label: "Each gap is worth", a: 5 }, { label: "Temperature", a: 15, post: DEG }],
          slips: [[0, 1, "Count the spaces, not the lines. There is a space each side of the middle mark."], [1, 1, "10 shared between 2 gaps is 5."], [2, 11, "Each gap is worth 5, so one gap above 10 is 15."]],
          why: "2 gaps share 10, so each gap is 5. One gap above 10 is <b>15</b>." },
            spicy: { fig: one(0, 50, 10, 2.5, 17.5), boxes: [{ label: "Gaps between 10 and 20", a: 4 }, { label: "Each gap is worth", a: 2.5 }, { label: "Temperature", a: 17.5, post: DEG }],
          slips: [[0, 3, "Count the spaces, not the lines. There are 4 spaces."], [1, 2, "10 shared between 4 gaps is 2.5."], [2, 13, "Each gap is 2.5, not 1."]],
          why: "4 gaps share 10, so each gap is 2.5. Three gaps above 10: 12.5, 15, <b>17.5</b>." } } },

    { type: "num", topic: "Marks in between",
      q: "This time there are two boxes. What is each gap worth, and what does it read?",
      fig: one(0, 40, 10, 2, 32),
      boxes: [{ label: "Each gap is worth", a: 2 }, { label: "Temperature", a: 32, post: DEG }],
      slips: [[1, 31, "It is one gap above 30, but each gap is worth 2, not 1."], [0, 1, "Share 10 between the 5 gaps."]],
      hint: "Same steps: two labels, count the gaps, share, count up.",
      why: "Each gap is 2. One gap above 30 is <b>32</b>.",
      ez: { q: "What is each gap worth? What does it read?", hint: "Count the gaps. Share. Count up.", why: "Each gap is 5. So <b>35</b>.", slips: [[null, null, "Each gap is 5, not 1."], [null, null, "That is the gaps. Share 10."]] },
      lv: { mild: { fig: one(0, 40, 10, 5, 35), boxes: [{ label: "Each gap is worth", a: 5 }, { label: "Temperature", a: 35, post: DEG }],
          slips: [[1, 31, "One gap above 30, but each gap is worth 5, not 1."], [0, 2, "That is how many gaps. Share 10 between them."]],
          why: "Each gap is 5. One gap above 30 is <b>35</b>." },
            spicy: { fig: one(0, 50, 10, 2.5, 27.5), boxes: [{ label: "Each gap is worth", a: 2.5 }, { label: "Temperature", a: 27.5, post: DEG }],
          slips: [[1, 23, "Three gaps above 20, but each gap is 2.5, not 1."], [1, 26, "Each gap is 2.5, so three gaps is 7.5."], [0, 2, "Share 10 between 4 gaps: 2.5."]],
          why: "Each gap is 2.5. Three gaps above 20: 22.5, 25, <b>27.5</b>." } } },

    { type: "num", topic: "Marks in between", explain: true,
      q: "All on your own now. What does this thermometer in [[room]] read?",
      fig: one(0, 50, 10, 2, 48),
      boxes: [{ label: "Temperature", a: 48, post: DEG }],
      slips: [[44, "Four gaps above 40, but each gap is worth 2."], [42, "Count all the gaps above 40: there are 4, each worth 2."]],
      hint: "Find the gap size first.",
      why: "Each gap is 2. Four gaps above 40: 42, 44, 46, <b>48</b>. Toasty.",
      ez: { q: "On your own. What does it read?", hint: "Find the gap size first.", why: "Each gap is 5. So <b>45</b>.", slips: [[null, "Each gap is 5, not 1."], [null, "Red goes 1 gap past 40."]] },
      lv: { mild: { fig: one(0, 50, 10, 5, 45), boxes: [{ label: "Temperature", a: 45, post: DEG }],
          slips: [[41, "One gap above 40, but each gap is worth 5."], [40, "The red line goes one gap past 40."]],
          why: "Each gap is 5. One gap above 40 is <b>45</b>." },
            spicy: { q: "The vet takes Bonnie's temperature. Dogs run a bit warmer than people. What does it read?",
          fig: '<svg viewBox="0 0 520 300" role="img" aria-label="Bonnie the poodle next to a thermometer from 37 to 40 degrees">' +
            '<rect width="520" height="300" rx="16" fill="#f4f1ea"/>' + thermo(170, { min: 37, max: 40, major: 1, minor: 0.2, val: 38.6 }) + A2ART.bonnie(370, 170, 1.3, "sit") + '</svg>',
          boxes: [{ label: "Temperature", a: 38.6, post: DEG }],
          slips: [[38.3, "Three gaps above 38, but each gap is 0.2, not 0.1."], [41, "Each gap is a small decimal here. Share 1 between the gaps."]],
          hint: "Labels go up in 1s. How many gaps between 38 and 39?",
          why: "5 gaps share 1, so each is 0.2. Three gaps above 38: 38.2, 38.4, <b>38.6</b>. Bonnie is fine, and very fluffy." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "Hotter or colder?", title: "Bigger number, hotter",
      fig: jumps(10, 30, [12, 20, 28], "Counting up from 12 to 28: plus 8 then plus 8, which is 16"),
      html: "<p>The <b>bigger</b> the number, the <b>hotter</b> it is.</p>" +
        "<p>To find <b>how much hotter</b>, count up from the colder one to the hotter one. From 12" + DEG + " to 28" + DEG + ": jump 8 to get to 20, then 8 more to get to 28. That is <b>16 degrees hotter</b>.</p>" +
        "<p>Or take away: 28 - 12 = 16. Same answer.</p>",
      ez: { title: "Bigger is hotter", html: "<p><b>Bigger</b> number, <b>hotter</b>.</p><p>20 to 30 is a jump of 10. <b>10 degrees hotter</b>.</p>" },
      lv: { mild: { fig: jumps(0, 40, [20, 30], "Counting up from 20 to 30: plus 10"),
          html: "<p>The <b>bigger</b> the number, the <b>hotter</b> it is. 30" + DEG + " is hotter than 20" + DEG + ".</p>" +
          "<p>To find <b>how much hotter</b>, count up from the colder one. From 20 to 30 is one jump of 10. So 30" + DEG + " is <b>10 degrees hotter</b>.</p>" },
            spicy: { fig: jumps(12, 32, [12.8, 13, 31, 31.5], "Counting up from 12.8 to 31.5: plus 0.2, plus 18, plus 0.5, which is 18.7 (not to scale)", true),
          html: "<p>Bigger number, hotter. With decimals, <b>line up the decimal points</b>: 38.2 is 38.20, which beats 38.15.</p>" +
          "<p>For a difference, count up in friendly jumps. From 12.8 to 31.5: +0.2 to 13, +18 to 31, +0.5 to 31.5. Total <b>18.7 degrees</b>.</p>" } } },

    { type: "mc", topic: "Hotter or colder?",
      q: "Which day was hotter in [[room]]?",
      options: ["Monday: 15" + DEG, "Tuesday: 25" + DEG],
      answer: 1, fixed: true,
      slips: { 0: "15 is less than 25, so Monday was colder." },
      hint: "Which number is bigger?",
      why: "25 is bigger than 15, so Tuesday was hotter.",
      ez: { q: "Which day was hotter?", hint: "Which number is bigger?", why: "25 is bigger. <b>Tuesday</b> was hotter.", slips: { 0: "15 is smaller, so Monday was colder." } },
      lv: { medium: { q: "Which day was hottest in [[room]]?", options: ["Monday: 19" + DEG, "Tuesday: 21" + DEG, "Wednesday: 12" + DEG],
          slips: { 0: "19 ends in a big 9, but 21 has more tens. 21 is bigger.", 2: "12 is the smallest, so Wednesday was coldest." },
          hint: "Look at the tens first.",
          why: "21 has 2 tens, more than 19 or 12. Tuesday was hottest." },
            spicy: { q: "Three readings from [[hot]]. Which was the hottest?", options: ["Monday: 38.2" + DEG, "Tuesday: 38.15" + DEG, "Wednesday: 38.09" + DEG],
          answer: 0,
          slips: { 1: "15 looks bigger than 2, but line up the points: 38.20 beats 38.15.", 2: "38.09 is the smallest: it has 0 tenths." },
          hint: "Write them all with two decimal places.",
          why: "38.20, 38.15, 38.09. Compare the tenths: 2 is bigger than 1 and 0. Monday was hottest." } } },

    { type: "order", topic: "Hotter or colder?",
      q: "Put these in order, <b>coldest first</b>.",
      items: ["[[Cold]]: 3" + DEG, "[[Room]]: 18" + DEG, "[[Hot]]: 35" + DEG],
      hint: "Smallest number first.",
      why: "3, then 18, then 35. Smallest number is coldest.",
      ez: { q: "Put them in order. <b>Coldest first</b>.", hint: "Smallest number first.", why: "3, then 18, then 35." },
      lv: { medium: { items: ["[[Cold]]: 6" + DEG, "[[Room]]: 19" + DEG, "[[Hot]]: 31" + DEG, "A warm bath: 40" + DEG],
          why: "6, 19, 31, 40." },
            spicy: { items: ["[[Cold]]: 9.75" + DEG, "[[Room]]: 19.05" + DEG, "Jay's forgotten cup of tea: 19.5" + DEG, "[[Hot]]: 31" + DEG],
          hint: "Line up the decimal points. 19.05 and 19.5 are not the same.",
          why: "9.75, 19.05, 19.50, 31. 19.05 has 0 tenths, so it is colder than 19.5. (Jay's tea is stone cold.)" } } },

    { type: "num", topic: "Hotter or colder?",
      q: "[[Hot]] is 28" + DEG + ". [[Cold]] is 12" + DEG + ". How many degrees hotter is [[hot]]?",
      fig: jumps(10, 30, [12, 20, 28], "Counting up from 12 to 28"),
      boxes: [{ label: "Degrees hotter", a: 16 }],
      slips: [[40, "You added them. For how much hotter, count up from 12 to 28, or take away."], [14, "Count the jumps again: 12 to 20 is 8, 20 to 28 is 8."]],
      hint: "Count up from 12 to 28.",
      why: "8 + 8 = 16, or 28 - 12 = 16. It is <b>16 degrees</b> hotter.",
      ez: { q: "[[Hot]] is 30" + DEG + ". [[Room]] is 20" + DEG + ". How much hotter?", hint: "Count up from 20 to 30.", why: "One jump of <b>10</b>.", slips: [[null, "You added them. Count up instead."], [null, "Count in tens. 20 to 30 is 10."]] },
      lv: { mild: { q: "[[Hot]] is 30" + DEG + ". [[Room]] is 20" + DEG + ". How many degrees hotter is [[hot]]?",
          fig: jumps(0, 40, [20, 30], "Counting up from 20 to 30"),
          boxes: [{ label: "Degrees hotter", a: 10 }],
          slips: [[50, "You added them. Count up from 20 to 30 instead."], [1, "Count in tens: 20 to 30 is one jump of 10."]],
          hint: "Count up from 20 to 30.",
          why: "20 to 30 is one jump of <b>10</b>." },
            spicy: { q: "[[Hot]] is 31.5" + DEG + ". [[Cold]] is 12.8" + DEG + ". How many degrees hotter is [[hot]]?",
          fig: null,
          boxes: [{ label: "Degrees hotter", a: 18.7 }],
          slips: [[19.3, "Careful: you took 0.5 from 0.8. Count up from 12.8 instead: +0.2, +18, +0.5."], [44.3, "You added them. Take away, or count up from 12.8."]],
          hint: "Count up from 12.8 in friendly jumps: to 13, to 31, to 31.5.",
          why: "0.2 + 18 + 0.5 = <b>18.7</b>. Or 31.5 - 12.8 = 18.7." } } },

    { type: "sort", topic: "Hotter or colder?",
      q: "Sort them: hotter than 20" + DEG + " or not?",
      buckets: ["Hotter than 20" + DEG, "Not hotter than 20" + DEG],
      cards: [["25" + DEG, 0], ["18" + DEG, 1], ["30" + DEG, 0], ["12" + DEG, 1]],
      hint: "Is the number bigger than 20?",
      why: "25 and 30 are bigger than 20. 18 and 12 are smaller.",
      ez: { q: "Hotter than 20" + DEG + " or not?", hint: "Is it bigger than 20?", why: "25 and 30 are bigger than 20." },
      lv: { medium: { cards: [["25" + DEG, 0], ["18" + DEG, 1], ["21" + DEG, 0], ["12" + DEG, 1], ["20" + DEG, 1], ["32" + DEG, 0]],
          hint: "Is it bigger than 20? Careful with 20 itself.",
          why: "20" + DEG + " is not hotter than 20" + DEG + ": it is the same. 21, 25 and 32 are hotter." },
            spicy: { q: "Sort them: above 37.5" + DEG + " or not?", buckets: ["Above 37.5" + DEG, "Not above 37.5" + DEG],
          cards: [["37.8" + DEG, 0], ["37.25" + DEG, 1], ["38.1" + DEG, 0], ["37.45" + DEG, 1], ["37.5" + DEG, 1], ["37.62" + DEG, 0]],
          hint: "Line up the decimal points and compare tenths, then hundredths.",
          why: "37.8, 38.1 and 37.62 are above 37.50. 37.5 is equal, so not above." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Hot or not in real life", title: "Temperatures worth knowing",
      fig: REF,
      ez: { title: "Good to know", html: "<p>Fridge <b>4" + DEG + "</b>. Room <b>20" + DEG + "</b>. Body <b>37" + DEG + "</b>.</p><p>Boiling water <b>100" + DEG + "</b>.</p>" },
      html: "<p>Knowing a few temperatures helps you check whether a number makes sense.</p>" +
        "<p>A <b>fridge</b> is about 4" + DEG + ". A comfy <b>room</b> is about 20" + DEG + ". A <b>hot day</b> here is about 30" + DEG + ". Your <b>body</b> is about 37" + DEG + ". A warm <b>bath</b> is about 40" + DEG + ". Water <b>boils</b> at 100" + DEG + ".</p>" },

    { type: "match", topic: "Hot or not in real life",
      q: "Match each one to its temperature.",
      pairs: [["Inside a fridge", "4" + DEG], ["A comfy room", "20" + DEG], ["Boiling water", "100" + DEG]],
      hint: "Fridges are cold, kettles are very hot.",
      why: "Fridge 4" + DEG + ", room 20" + DEG + ", boiling 100" + DEG + ".",
      ez: { hint: "Fridges are cold. Kettles are very hot." },
      lv: { medium: { pairs: [["Inside a fridge", "4" + DEG], ["A comfy room", "20" + DEG], ["Your body", "37" + DEG], ["Boiling water", "100" + DEG]] },
            spicy: { pairs: [["Inside a fridge", "4" + DEG], ["A hot day in Britain", "30" + DEG], ["Your body", "37" + DEG], ["A warm bath", "40" + DEG], ["Boiling water", "100" + DEG]],
              hint: "30, 37 and 40 are close. Your body is a little cooler than a warm bath.",
              why: "A warm bath feels warm because it is a bit hotter than you: 40" + DEG + " against 37" + DEG + "." } } },

    { type: "mc", topic: "Hot or not in real life",
      q: "Which temperature makes sense for [[room]]?",
      options: ["20" + DEG, "100" + DEG, "1" + DEG],
      answer: 0,
      slips: { 1: "100" + DEG + " is boiling water. Nobody could stay in there.", 2: "1" + DEG + " is colder than a fridge. Brrr." },
      hint: "Think about a comfy room.",
      why: "About 20" + DEG + " is comfy for a room.",
      ez: { q: "Which makes sense for [[room]]?", hint: "Think of a comfy room.", why: "<b>20" + DEG + "</b> is comfy for a room.", slips: { 1: "100" + DEG + " is boiling water!", 2: "1" + DEG + " is colder than a fridge. Brrr." } },
      lv: { spicy: { q: "A report says [[hot]] reached 300" + DEG + ". What has most likely happened?",
        options: ["A typing slip: 30" + DEG + " makes sense", "It was just a warm day", "That is about body temperature", "That is a normal room temperature"],
        slips: { 1: "300" + DEG + " is three times hotter than boiling water. Not a warm day.", 2: "Body temperature is about 37" + DEG + ".", 3: "Rooms are about 20" + DEG + "." },
        hint: "Compare 300 with boiling water at 100.",
        why: "300" + DEG + " is far hotter than boiling water, so it cannot be right. An extra 0 is a likely slip: 30" + DEG + " makes sense." } } },

    { type: "widget", topic: "Hot or not in real life", unscored: true,
      title: "Set the thermometer",
      html: "<p>Have a go at setting the thermometer for [[room]] to the target. Slide until the top of the red line is in the right place.</p>",
      ez: { html: "<p>Slide the red line to the target.</p>" },
      mount: setWidget,
      report: function(d){ return d && typeof d.v === "number" ? "Set the thermometer to " + fmt(d.v) + (d.hit ? " (on target)." : ".") : ""; } },

    { type: "mc", topic: "Hot or not in real life",
      q: "Jay says: \"When I was in China, it was 40" + DEG + " one day.\" Hot or not?",
      fig: '<svg viewBox="0 0 400 160" role="img" aria-label="Jay, looking amazed, remembering a hot day">' + A2ART.jay(100, 54, 0.85, "wow") + A2ART.bubble(160, 10, 220, 52, "When I was in China...", 170) +
        '<g transform="translate(330 120)"><circle r="18" fill="#ffd23f" stroke="#141a33" stroke-width="2.5"/><path d="M0 -28v-6M0 28v6M-28 0h-6M28 0h6" stroke="#ff8a3d" stroke-width="3" stroke-linecap="round"/></g></svg>',
      options: ["Hot: hotter than a hot day here", "Cold: about the same as a fridge", "Just right: about room temperature"],
      answer: 0,
      slips: { 1: "A fridge is about 4" + DEG + ". 40 is ten times that.", 2: "A room is about 20" + DEG + ". 40 is double." },
      hint: "Compare 40 with the temperatures worth knowing.",
      why: "40" + DEG + " is as hot as a warm bath. Very hot for weather.",
      ez: { q: "Jay says: \"In China, it was 40" + DEG + " one day.\" Hot or not?", hint: "Compare 40 with a room.", why: "<b>Hot</b>. 40" + DEG + " is like a warm bath.", slips: { 1: "A fridge is 4" + DEG + ". 40 is far more.", 2: "A room is 20" + DEG + ". 40 is double." } },
      lv: { spicy: { q: "Jay says: \"When I was in China, it was 40" + DEG + " one day and 28.5" + DEG + " the next.\" How much cooler was the second day?",
        options: ["11.5 degrees cooler", "12.5 degrees cooler", "68.5 degrees cooler", "22.5 degrees cooler"],
        slips: { 1: "Count up from 28.5: +1.5 to 30, then +10 to 40. That is 11.5.", 2: "You added them. Take away, or count up.", 3: "Check the tens: 28.5 to 40 is less than 12." },
        hint: "Count up from 28.5 to 30, then to 40.",
        why: "1.5 + 10 = 11.5 degrees cooler. Still toasty." } } }
  ],

  ez: {
    blurb: "Read a thermometer. Hotter or colder?",
    realWorld: { title: "Who reads temperatures?", html: "<p>Chefs, nurses and vets <b>read temperatures</b> every day.</p><p>Time travel? Check the thermometer before you jump!</p>" },
    make: { intro: "Pick a place and a temperature. Hot or not?", fields: [{}, { label: "Temperature, 0 to 50" }] }
  },

  realWorld: {
    title: "Who reads temperatures for real?",
    html: "<p>Weather forecasters, chefs checking fridges, nurses and vets checking patients, and anglers checking the water all read temperatures every day.</p>" +
      "<p>For our big question, if we could time travel, should we? You would want to know what you are stepping into. The ice age? A desert in ancient Egypt? Check the thermometer before you jump.</p>",
    fig: '<svg viewBox="0 0 440 300" role="img" aria-label="A time portal with a thermometer beside it">' + '<rect width="440" height="300" rx="16" fill="#f4f1ea"/>' +
      A2ART.portal(110, 140, 80) + thermo(280, { min: 0, max: 50, major: 10, minor: 5, val: 35 }) + A2ART.bird(400, 60, 0.7, "#ff5d5d") + '</svg>'
  },

  make: {
    title: "Make a hot or not card",
    intro: "Pick a place, give it a temperature, and decide: hot or not? The thermometer fills itself in. Keep it or send it to Jay.",
    fields: [
      { id: "place", label: "Where", ph: "[[RoomS]]", max: 40 },
      { id: "temp", label: "Temperature (a number from 0 to 50)", ph: "21", max: 5 },
      { id: "verdict", label: "Hot or not?", ph: "Not. Just right for a cuppa.", max: 50 },
      { id: "name", label: "Weather reporter", ph: "Agent B5", max: 24 }
    ],
    svg: function(v){
      var n = parseFloat(String(v.temp).replace(/[^0-9.]/g, ""));
      var ok = !isNaN(n), val = ok ? Math.max(0, Math.min(50, n)) : 0;
      var place = wrap(v.place, 22, 2), verdict = wrap(v.verdict, 28, 3);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" rx="24" fill="#fff4e6"/>' +
        '<rect x="14" y="14" width="572" height="372" rx="18" fill="none" stroke="#141a33" stroke-width="4" stroke-dasharray="14 8"/>' +
        thermo(90, { min: 0, max: 50, major: 10, minor: 5, val: ok ? val : null, top: 70, h: 240 }) +
        T(200, 66, "HOT OR NOT?", 26, { b: 1, c: "#e04848" }) +
        place.map(function(l, k){ return T(200, 110 + k * 32, esc(l), 26, { b: 1 }); }).join("") +
        T(200, 196, ok ? esc(fmt(n)) + DEG : esc(String(v.temp).slice(0, 5)), 44, { b: 1, c: "#e04848" }) +
        verdict.map(function(l, k){ return T(200, 246 + k * 28, esc(l), 21); }).join("") +
        T(560, 366, "Reporter: " + esc(wrap(v.name, 22, 1)[0] || ""), 15, { b: 1, a: "end", c: "#5b6180" }) +
        '</svg>';
    }
  }
};
})();
