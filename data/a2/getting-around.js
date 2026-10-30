/* Base 5 Autumn 2 activity: Getting around.
   Preparation for Adulthood. Common types of public transport, what
   they are for and what they cost, then a trip challenge to try away
   from the screen. ASCII only. */
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
var INK = "#141a33";
var ICON = {
  bus: '<rect x="-42" y="-30" width="84" height="50" rx="9" fill="#e04848" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<rect x="-34" y="-22" width="16" height="16" rx="2" fill="#e8f7ff"/><rect x="-14" y="-22" width="16" height="16" rx="2" fill="#e8f7ff"/><rect x="6" y="-22" width="16" height="16" rx="2" fill="#e8f7ff"/>' +
    '<rect x="26" y="-22" width="10" height="34" rx="2" fill="#e8f7ff"/><path d="M-42 2h68" stroke="#fff" stroke-width="3"/>' +
    '<circle cx="-24" cy="22" r="9" fill="' + INK + '"/><circle cx="22" cy="22" r="9" fill="' + INK + '"/><circle cx="-24" cy="22" r="3" fill="#c8ccd2"/><circle cx="22" cy="22" r="3" fill="#c8ccd2"/>',
  train: '<path d="M-46 18v-34q0 -12 12 -12h56q24 0 24 24v22z" fill="#3a8fd6" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<rect x="-38" y="-20" width="14" height="14" rx="2" fill="#e8f7ff"/><rect x="-18" y="-20" width="14" height="14" rx="2" fill="#e8f7ff"/><rect x="2" y="-20" width="14" height="14" rx="2" fill="#e8f7ff"/>' +
    '<path d="M24 -20h6q10 0 12 14h-18z" fill="#e8f7ff"/><path d="M-46 4h92" stroke="#ffd23f" stroke-width="4"/>' +
    '<circle cx="-30" cy="22" r="6" fill="' + INK + '"/><circle cx="-14" cy="22" r="6" fill="' + INK + '"/><circle cx="16" cy="22" r="6" fill="' + INK + '"/><circle cx="32" cy="22" r="6" fill="' + INK + '"/>' +
    '<path d="M-50 30h100" stroke="#7a5532" stroke-width="4"/>',
  tram: '<path d="M-10 -44l10 10 10 -10" fill="none" stroke="' + INK + '" stroke-width="2.5"/><path d="M-50 -44h100" stroke="' + INK + '" stroke-width="1.5"/>' +
    '<rect x="-44" y="-32" width="88" height="50" rx="12" fill="#ffd23f" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<rect x="-36" y="-24" width="20" height="18" rx="3" fill="#e8f7ff"/><rect x="-10" y="-24" width="20" height="18" rx="3" fill="#e8f7ff"/><rect x="16" y="-24" width="20" height="18" rx="3" fill="#e8f7ff"/>' +
    '<rect x="-6" y="-2" width="12" height="20" fill="#8a5cf6"/>' +
    '<circle cx="-28" cy="22" r="6" fill="' + INK + '"/><circle cx="28" cy="22" r="6" fill="' + INK + '"/><path d="M-50 30h100" stroke="#7a5532" stroke-width="4"/>',
  coach: '<rect x="-50" y="-28" width="100" height="48" rx="10" fill="#19c39a" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<rect x="-42" y="-20" width="78" height="18" rx="3" fill="#e8f7ff"/><rect x="38" y="-20" width="8" height="30" rx="2" fill="#e8f7ff"/>' +
    '<rect x="-30" y="4" width="34" height="12" rx="2" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
    '<circle cx="-30" cy="22" r="9" fill="' + INK + '"/><circle cx="28" cy="22" r="9" fill="' + INK + '"/><circle cx="-30" cy="22" r="3" fill="#c8ccd2"/><circle cx="28" cy="22" r="3" fill="#c8ccd2"/>',
  taxi: '<path d="M-44 14v-14q0 -6 6 -8l12 -16q4 -4 10 -4h32q6 0 10 4l12 16q6 2 6 8v14z" fill="#2b2b2b" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<path d="M-22 -10l8 -12h12v12zM6 -10v-12h12l8 12z" fill="#e8f7ff"/>' +
    '<rect x="-14" y="-38" width="28" height="12" rx="3" fill="#ffd23f" stroke="' + INK + '" stroke-width="2"/>' +
    '<circle cx="-26" cy="16" r="9" fill="' + INK + '"/><circle cx="26" cy="16" r="9" fill="' + INK + '"/><circle cx="-26" cy="16" r="3" fill="#c8ccd2"/><circle cx="26" cy="16" r="3" fill="#c8ccd2"/>',
  ferry: '<path d="M-50 4h100l-14 22h-72z" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<rect x="-34" y="-14" width="62" height="18" rx="3" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<rect x="-26" y="-9" width="10" height="8" fill="#3a8fd6"/><rect x="-10" y="-9" width="10" height="8" fill="#3a8fd6"/><rect x="6" y="-9" width="10" height="8" fill="#3a8fd6"/>' +
    '<rect x="2" y="-32" width="14" height="18" fill="#e04848" stroke="' + INK + '" stroke-width="2.5"/><path d="M-50 12h100" stroke="#e04848" stroke-width="3"/>' +
    '<path d="M-56 32q9 -6 18 0t18 0t18 0t18 0t18 0t18 0" fill="none" stroke="#3a8fd6" stroke-width="3"/>'
};
var NAMES = { bus: "Bus", train: "Train", tram: "Tram", coach: "Coach", taxi: "Taxi", ferry: "Ferry" };
var COLS = { bus: "#ffd9d9", train: "#d9ecff", tram: "#fff3c4", coach: "#d4f5ea", taxi: "#ececec", ferry: "#dff3fb" };

var SIX = '<svg viewBox="0 0 540 300" role="img" aria-label="Six kinds of transport: bus, train, tram, coach, taxi and ferry">' +
  '<rect width="540" height="300" rx="16" fill="#f4f1ea"/>' +
  ["bus", "train", "tram", "coach", "taxi", "ferry"].map(function(k, i){
    var x = 95 + (i % 3) * 175, y = 72 + Math.floor(i / 3) * 140;
    return '<rect x="' + (x - 78) + '" y="' + (y - 56) + '" width="156" height="122" rx="14" fill="' + COLS[k] + '" stroke="' + INK + '" stroke-opacity=".2" stroke-width="2"/>' +
      '<g transform="translate(' + x + ' ' + y + ')">' + ICON[k] + '</g>' + T(x, y + 56, NAMES[k], 16, { b: 1, a: "middle" });
  }).join("") +
  A2ART.egg(A2ART.bird(520, 22, 0.55, "#ff8a3d"), "A bird. It never needs a ticket. Jay is very jealous.") +
  '</svg>';

function one(k, label){
  return '<svg viewBox="0 0 320 160" role="img" aria-label="A picture of a vehicle">' +
    '<rect width="320" height="160" rx="14" fill="' + COLS[k] + '"/>' +
    '<g transform="translate(160 76) scale(1.7)">' + ICON[k] + '</g>' + (label ? T(160, 150, label, 14, { a: "middle", c: "#5b6180" }) : "") + '</svg>';
}

/* the bus stop: Jay with his hand out */
var STOP = '<svg viewBox="0 0 520 220" role="img" aria-label="Jay at a bus stop holding his hand out as a bus comes">' +
  '<rect width="520" height="220" rx="16" fill="#e8f7ff"/><rect y="176" width="520" height="44" fill="#c8ccd2"/><path d="M0 198h520" stroke="#fff" stroke-width="4" stroke-dasharray="26 18"/>' +
  '<path d="M300 176v-130" stroke="#5b6180" stroke-width="6"/><circle cx="300" cy="40" r="22" fill="#e04848" stroke="' + INK + '" stroke-width="2.5"/>' + T(300, 46, "BUS", 14, { b: 1, a: "middle", c: "#fff" }) +
  '<rect x="282" y="70" width="36" height="44" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="2"/><path d="M288 80h24M288 90h24M288 100h18" stroke="' + INK + '" stroke-width="2"/>' +
  A2ART.jay(390, 100, 0.85, "smile") +
  '<path d="M360 150l-36 -22" stroke="#2f6f8f" stroke-width="12" stroke-linecap="round"/><circle cx="322" cy="126" r="8" fill="#f6d1b0"/>' +
  '<g transform="translate(110 150) scale(1.5)">' + ICON.bus + '</g>' +
  A2ART.bubble(400, 6, 112, 52, "Hand out,\nnice and clear.", 420) +
  '</svg>';

/* near to far */
var DIST = '<svg viewBox="0 0 540 230" role="img" aria-label="Near to far: walk or cycle, bus or tram, train or coach, ferry or plane">' +
  '<rect width="540" height="230" rx="16" fill="#f4f1ea"/>' +
  '<path d="M40 120h470" stroke="' + INK + '" stroke-width="4"/><path d="M500 110l14 10 -14 10z" fill="' + INK + '"/>' +
  '<path d="M26 118l16 -16 16 16v20h-32z" fill="#ffd23f" stroke="' + INK + '" stroke-width="2.5"/>' + T(42, 160, "Home", 13, { b: 1, a: "middle" }) +
  [["Walk or", "cycle", "Down the road", "#ff5d8f", 110],
   ["Bus or", "tram", "Across town", "#e04848", 220],
   ["Train or", "coach", "Another city", "#3a8fd6", 340],
   ["Ferry or", "plane", "Over the sea", "#19c39a", 460]].map(function(c){
    return '<circle cx="' + c[4] + '" cy="120" r="12" fill="' + c[3] + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      T(c[4], 58, c[0], 15, { b: 1, a: "middle" }) + T(c[4], 78, c[1], 15, { b: 1, a: "middle" }) +
      T(c[4], 162, c[2], 13, { a: "middle", c: "#5b6180" });
  }).join("") +
  T(270, 210, "The further you go, the bigger the transport.", 14, { a: "middle", c: "#5b6180" }) + '</svg>';

/* three tickets */
function ticket(x, col, name, arrow, small){
  return '<g transform="translate(' + x + ' 30)"><path d="M0 0h150v46a12 12 0 0 0 0 24v46h-150v-46a12 12 0 0 0 0 -24z" fill="' + col + '" stroke="' + INK + '" stroke-width="2.5"/>' +
    '<path d="M110 6v104" stroke="' + INK + '" stroke-width="2" stroke-dasharray="5 5"/>' +
    T(14, 30, name, 16, { b: 1 }) + arrow + T(14, 104, small, 13, { c: "#5b6180" }) + '</g>';
}
var TICKETS = '<svg viewBox="0 0 540 190" role="img" aria-label="Three tickets: a single, a return and a day ticket">' +
  '<rect width="540" height="190" rx="16" fill="#f4f1ea"/>' +
  ticket(20, "#fffbe0", "Single", '<path d="M18 62h66" stroke="' + INK + '" stroke-width="4"/><path d="M80 52l14 10 -14 10z" fill="' + INK + '"/>', "One way") +
  ticket(195, "#e8f7ff", "Return", '<path d="M18 54h66M26 74h66" stroke="' + INK + '" stroke-width="4"/><path d="M80 44l14 10 -14 10zM30 64l-14 10 14 10z" fill="' + INK + '"/>', "There and back") +
  ticket(370, "#ffeef4", "Day", '<circle cx="54" cy="62" r="14" fill="#ffd23f" stroke="' + INK + '" stroke-width="2"/><path d="M54 40v-6M54 90v-6M32 62h-6M82 62h-6M38 46l-4 -4M70 46l4 -4M38 78l-4 4M70 78l4 4" stroke="' + INK + '" stroke-width="2.5"/>', "All day long") +
  T(270, 178, "Example prices only: real ones change by area.", 13, { a: "middle", c: "#5b6180" }) + '</svg>';

/* worked example: two singles or a return */
var WORKED = '<svg viewBox="0 0 540 190" role="img" aria-label="Worked example: two singles cost 4 pounds, a return costs 3 pounds 50, so the return saves 50p">' +
  '<rect width="540" height="190" rx="16" fill="#f4f1ea"/>' +
  '<rect x="20" y="20" width="230" height="110" rx="12" fill="#fffbe0" stroke="' + INK + '" stroke-width="2"/>' +
  T(135, 48, "Two singles", 16, { b: 1, a: "middle" }) + T(135, 80, "&#163;2 + &#163;2", 18, { a: "middle" }) + T(135, 112, "= &#163;4.00", 20, { b: 1, a: "middle" }) +
  '<rect x="290" y="20" width="230" height="110" rx="12" fill="#e8f7ff" stroke="' + INK + '" stroke-width="2"/>' +
  T(405, 48, "One return", 16, { b: 1, a: "middle" }) + T(405, 80, "there and back", 15, { a: "middle", c: "#5b6180" }) + T(405, 112, "= &#163;3.50", 20, { b: 1, a: "middle" }) +
  T(270, 166, "&#163;4.00 take away &#163;3.50 = 50p saved", 17, { b: 1, a: "middle", c: "#1f9d63" }) + '</svg>';

/* before you go */
var BEFORE = '<svg viewBox="0 0 540 240" role="img" aria-label="Before you go: where and when, ticket or money, phone charged, who knows, plan B">' +
  '<rect width="540" height="240" rx="16" fill="#f4f1ea"/>' +
  '<rect x="24" y="20" width="300" height="204" rx="10" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/><rect x="134" y="10" width="80" height="20" rx="6" fill="#c99a63" stroke="' + INK + '" stroke-width="2"/>' +
  ["Where and when", "Ticket or money", "Phone charged", "Someone knows", "A plan B"].map(function(t, k){
    var y = 60 + k * 36;
    return '<rect x="44" y="' + (y - 16) + '" width="20" height="20" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M48 ' + (y - 6) + 'l5 6 9 -12" fill="none" stroke="#1f9d63" stroke-width="3"/>' + T(76, y, t, 16);
  }).join("") +
  A2ART.bonnie(430, 150, 1.1, "sit") + A2ART.bubble(350, 20, 170, 52, "Lead packed?\nGood.", 420) + '</svg>';

/* ---------- widget: the trip challenge ---------- */
var CH = [
  { id: "spot", name: "Spotter", line: "On your next trip anywhere, spot the transport.",
    ticks: ["Spot a bus stop and read its sign", "Spot a bus and read where it is going", "Find out one fare (ask, look on a sign or online)", "Tell Jay what you spotted, if you like"] },
  { id: "ride", name: "Rider", line: "Take a short bus or tram trip with someone you trust.",
    ticks: ["Pick a place and check the time of the bus", "Sort out a ticket or a way to pay", "Hold out a hand to stop it", "Press the bell before your stop", "Tell Jay how it went, if you like"] },
  { id: "plan", name: "Planner", line: "Plan a longer trip with a change, and compare two ways.",
    ticks: ["Pick a real place in another town", "Find two ways to get there", "Note the time and cost of each", "Choose one and say why", "Do it for real one day, if you fancy it"] }
];
function tripWidget(el, api){
  var d = api.data || {};
  if(!d.pick) d.pick = api.level === "spicy" ? "plan" : api.level === "medium" ? "ride" : "spot";
  if(!d.ticks || typeof d.ticks !== "object") d.ticks = {};
  el.innerHTML = '<div class="a2task"><h4>Pick a challenge, if you like</h4><p>These are for away from the screen. Pick whichever suits you. Your ticks save here and can go to Jay.</p>' +
    '<div class="gw-pick" style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0"></div><p class="gw-line" style="font-weight:700;margin:8px 0"></p><div class="gw-list"></div></div>';
  var pick = el.querySelector(".gw-pick"), line = el.querySelector(".gw-line"), list = el.querySelector(".gw-list");
  function draw(){
    var c = CH.filter(function(x){ return x.id === d.pick; })[0] || CH[0];
    pick.innerHTML = CH.map(function(x){
      var on = x.id === c.id;
      return '<button type="button" data-c="' + x.id + '" aria-pressed="' + on + '" style="font:inherit;cursor:pointer;padding:8px 14px;border-radius:12px;border:3px solid ' + (on ? "#141a33" : "#d9d8e6") + ';background:' + (on ? "#ffd23f" : "#fff") + ';font-weight:' + (on ? 700 : 400) + '">' + x.name + '</button>';
    }).join("");
    line.textContent = c.line;
    var t = d.ticks[c.id] || (d.ticks[c.id] = []);
    list.innerHTML = "";
    c.ticks.forEach(function(txt, k){
      var lab = document.createElement("label");
      lab.style.cssText = "display:flex;gap:10px;align-items:center;margin:8px 0;font-size:1rem;cursor:pointer";
      var cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = !!t[k];
      cb.style.cssText = "width:22px;height:22px";
      cb.onchange = function(){ t[k] = cb.checked; try{ api.save(); }catch(err){} api.done("done"); };
      lab.appendChild(cb); lab.appendChild(document.createTextNode(txt));
      list.appendChild(lab);
    });
  }
  pick.addEventListener("click", function(e){
    var b = e.target && e.target.closest ? e.target.closest("button[data-c]") : null;
    if(!b) return;
    d.pick = b.getAttribute("data-c");
    try{ api.save(); }catch(err){}
    draw();
    api.done("done");
  });
  draw();
}

(window.A2PACKS = window.A2PACKS || {})["getting-around"] = {
  a2: true,
  id: "a2-getting-around",
  title: "Getting around",
  subject: "Preparation for Adulthood",
  bodyClass: "subj-home subj-pillar",
  mins: 20,
  line: "Buses, trains, trams and more: what each one is for, and what it costs.",
  blurb: "Getting around on public transport. Four short chunks: the kinds of transport, which one suits the job, what tickets cost, and a trip challenge to try away from the screen. You make your own journey ticket at the end.",
  note: "Buses, trains and tickets, plus a little trip challenge for away from the screen. Four five minute chunks and a journey ticket to make, whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Local hop", line: "Local hop: the kinds of transport, and simple ticket prices." },
    { id: "medium", name: "Day tripper", line: "Day tripper: choosing the best one for the job, and which ticket saves money." },
    { id: "spicy", name: "Long hauler", line: "Long hauler: weighing up time and cost, discounts and off peak fares." }
  ],
  themes: {
    time: { name: "Time travel", w: { place: "the time travel museum", event: "the time travel exhibition", city: "the history festival" } },
    football: { name: "Football", w: { place: "the stadium", event: "the match", city: "the away game" } },
    horror: { name: "Horror", w: { place: "the haunted manor", event: "the ghost walk", city: "the late night horror festival" } },
    fishing: { name: "Fishing", w: { place: "the lake", event: "the fishing match", city: "the big angling show" } },
    music: { name: "Music", w: { place: "the theatre", event: "the show", city: "the musical in the big city" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: SIX,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "Ways to get around", title: "Lots of ways to get around",
      ez: { title: "Ways to get around", html: "<p><b>Public transport</b> is for anyone to use.</p><p>Bus. Train. Tram. Coach. Taxi. Ferry.</p>" },
      fig: SIX,
      html: "<p><b>Public transport</b> is transport anyone can pay to use. You do not need to drive.</p>" +
        "<p>The big ones are the <b>bus</b>, <b>train</b>, <b>tram</b>, <b>coach</b>, <b>taxi</b> and <b>ferry</b>. Each one has its own job.</p>",
      lv: { spicy: { html: "<p><b>Public transport</b> is transport anyone can pay to use: bus, train, tram, coach and ferry.</p>" +
        "<p>Most of them run to a <b>timetable</b>: they leave at set times whether you are there or not. A <b>taxi</b> is different: it comes when you book it, and you pay more for that.</p>" +
        "<p>Knowing which is which helps you weigh up <b>time</b>, <b>cost</b> and how easy it is.</p>" } } },

    { type: "mc", topic: "Ways to get around",
      q: "What is this?",
      fig: one("train", "It runs on rails between stations."),
      options: ["A train", "A bus", "A ferry"],
      answer: 0,
      slips: { 1: "A bus runs on the road, with tyres. Look under this one: rails.", 2: "A ferry floats on water. This one is on rails." },
      hint: "Look at what it is sitting on.",
      why: "It runs on rails and stops at stations. That is a train.",
      ez: { why: "Rails and stations: a <b>train</b>.", slips: { 1: "A bus has tyres. This one has rails." } },
      lv: { medium: { q: "Which one runs on rails through city streets, sharing the road with cars?", fig: one("tram"),
          options: ["A tram", "A coach", "A taxi"],
          slips: { 1: "A coach uses roads and tyres, not rails.", 2: "A taxi is a car. No rails." },
          hint: "Look for rails in the road and a wire overhead.",
          why: "A tram runs on rails set into the road, powered by a wire above it." },
        spicy: { q: "Which one would you <b>book</b>, rather than check a timetable?", fig: one("taxi"),
          options: ["A taxi", "A tram", "A ferry"],
          slips: { 1: "Trams run to a timetable. You just turn up at the stop.", 2: "Ferries sail at set times on a timetable." },
          hint: "Which one comes to you when you ask?",
          why: "You book a taxi (or flag one down). It comes when you want it, not at a set time." } } },

    { type: "match", topic: "Ways to get around",
      q: "Where do you get on? Match each one.",
      pairs: [["Bus", "A bus stop"], ["Train", "A station platform"], ["Ferry", "A port"], ["Taxi", "A taxi rank, or book one"]],
      hint: "Think about where you would stand and wait for each one.",
      ez: { hint: "Where would you wait for each one?", why: "Each one has its own place to get on." },
      why: "Buses stop at bus stops, trains at platforms, ferries at ports, and taxis wait at a rank or come when booked.",
      lv: { spicy: { pairs: [["Bus", "A bus stop"], ["Train", "A station platform"], ["Ferry", "A port"], ["Taxi", "A taxi rank, or book one"], ["Coach", "A coach station"]] } } },

    { type: "sort", topic: "Ways to get around",
      q: "Sort them. On land or on water?",
      buckets: ["On land", "On water"],
      cards: [["Bus", 0], ["Ferry", 1], ["Tram", 0], ["River boat", 1], ["Train", 0]],
      hint: "Does it have wheels, or does it float?",
      why: "Buses, trams and trains have wheels. Ferries and river boats float.",
      lv: { medium: { q: "Sort them. Does it run to a timetable, or come when you book it?",
          buckets: ["Runs to a timetable", "Comes when you book it"],
          cards: [["Bus", 0], ["Taxi", 1], ["Train", 0], ["Ferry", 0], ["A minibus you book by phone", 1]],
          hint: "Does it leave at set times, or come when you ask?",
          why: "Buses, trains and ferries leave at set times. Taxis and booked minibuses come when you ask." },
        spicy: { q: "Sort them. Does it run to a timetable, or come when you book it?",
          buckets: ["Runs to a timetable", "Comes when you book it"],
          cards: [["Bus", 0], ["Taxi", 1], ["Train", 0], ["Ferry", 0], ["A minibus you book by phone", 1], ["Coach", 0]],
          hint: "Does it leave at set times, or come when you ask?",
          why: "Buses, trains, coaches and ferries leave at set times. Taxis and booked minibuses come when you ask, which is handy but costs more." } } },

    { type: "mc", topic: "Ways to get around",
      q: "Jay can see his bus coming. What helps it stop for him?",
      fig: STOP,
      options: ["Hold a hand out so the driver can see", "Stand behind the shelter", "Wave after it has gone past"],
      answer: 0,
      slips: { 1: "If the driver cannot see anyone waiting, the bus might not stop.", 2: "Too late by then. Signal while it is still coming towards you." },
      hint: "How does the driver know someone wants this bus?",
      why: "Hold your hand out clearly as it comes. In the wise words of Jay's late, great grandfather: stop.",
      ez: { hint: "How does the driver know?", why: "Hold your hand out. In the words of Jay's late, great grandfather: stop.", slips: { 1: "The driver needs to see you.", 2: "Too late. Signal while it is coming." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Which one for the job?", title: "Pick the transport for the trip",
      fig: DIST,
      ez: { title: "Pick the transport", html: "<p>Across town: <b>bus</b>. Another city: <b>train</b> or <b>coach</b>.</p><p>Over the sea: <b>ferry</b>. A <b>taxi</b> costs the most.</p>" },
      html: "<p>Short trips: <b>walk or cycle</b>. Across town: <b>bus or tram</b>. To another city: <b>train or coach</b>. Over the sea: <b>ferry or plane</b>.</p>" +
        "<p>A <b>taxi</b> can go anywhere, door to door, but it costs the most.</p>",
      lv: { medium: { html: "<p>Short trips: <b>walk or cycle</b>. Across town: <b>bus or tram</b>. To another city: <b>train or coach</b>. Over the sea: <b>ferry or plane</b>.</p>" +
          "<p>Between cities, a <b>train</b> is usually quicker and a <b>coach</b> is usually cheaper. A <b>taxi</b> is door to door but costs the most.</p>" },
        spicy: { html: "<p>Short trips: <b>walk or cycle</b>. Across town: <b>bus or tram</b>. To another city: <b>train or coach</b>. Over the sea: <b>ferry or plane</b>.</p>" +
          "<p>Choosing well means weighing three things: <b>time</b> (how long), <b>cost</b> (how much) and <b>ease</b> (changes, luggage, late nights). A coach might take twice as long as a train but cost half as much. Neither is the right answer for everyone.</p>" } } },

    { type: "mc", topic: "Which one for the job?",
      q: "You want to get to [[place]] on the other side of town. Which one is the usual choice?",
      options: ["The bus", "A plane", "A ferry"],
      answer: 0,
      slips: { 1: "Planes are for very long trips, often to other countries.", 2: "A ferry crosses water. Is there sea in the way?" },
      hint: "Across town is not very far.",
      why: "A bus is made for trips around town, with stops all over the place.",
      ez: { q: "You are going across town to [[place]]. Which one?", why: "A <b>bus</b> is made for trips around town.", slips: { 1: "Planes are for very long trips." } },
      lv: { medium: { q: "You are going to [[city]], 150 miles away, and you want to get there as fast as you can. Which one?",
          options: ["The train", "The coach", "The local bus"],
          slips: { 1: "Coaches are usually cheaper, but usually slower than the train.", 2: "A local bus would take all day and need lots of changes." },
          hint: "Which one is built for speed between cities?",
          why: "Between cities, the train is usually the quickest." },
        spicy: { q: "You are going to [[city]], 200 miles away. Money is tight and you do not mind a long ride. Which one?",
          options: ["The coach", "The train", "A taxi"],
          slips: { 1: "Usually quicker, but usually costs more. Here money matters more than time.", 2: "A taxi for 200 miles would cost a fortune." },
          hint: "Which one is cheapest between cities?",
          why: "The coach is usually the cheapest way between cities. It is slower, but you said time does not matter much." } } },

    { type: "sort", topic: "Which one for the job?",
      q: "Near or far? Sort the trips.",
      buckets: ["Near: across town", "Far: another city"],
      cards: [["To the shops in town", 0], ["To [[place]] across town", 0], ["To [[city]], 2 hours away", 1], ["To visit family in a city 100 miles away", 1]],
      hint: "Could you get there in about half an hour on a bus?",
      why: "Across town is a bus or tram trip. Another city is a train or coach trip.",
      ez: { hint: "Half an hour on a bus?", why: "Town: bus. Another city: train or coach." },
      lv: { medium: { q: "Which is the best fit? Sort the trips.",
          buckets: ["Bus", "Train", "Ferry"],
          cards: [["Across town to the cinema", 0], ["Between two big cities", 1], ["Out to an island", 2], ["To [[place]] across town", 0], ["To [[city]], 150 miles away", 1]],
          hint: "Town, city to city, or water in the way?",
          why: "Bus for town, train for city to city, ferry when the sea is in the way." },
        spicy: { q: "Which is the best fit? Sort the trips.",
          buckets: ["Coach", "Train", "Taxi"],
          cards: [["Cheapest way to [[city]], time no problem", 0], ["Fastest way to [[city]]", 1], ["Home at 1am with heavy bags, no buses running", 2], ["Cheap overnight trip between cities", 0], ["A meeting in another city at 9am sharp", 1]],
          hint: "Cheap and slow, fast, or door to door when nothing else runs?",
          why: "Coach when cost matters most, train when time matters most, taxi when nothing else is running." } } },

    { type: "mc", topic: "Which one for the job?",
      q: "Which way of getting to the shops makes the least pollution?",
      options: ["Walking or cycling", "A taxi", "Being driven in a car on your own"],
      answer: 0,
      slips: { 1: "A taxi burns fuel just like a car, and drives to you first.", 2: "One car for one person makes lots of pollution per person." },
      hint: "Which one has no engine at all?",
      why: "No engine, no fumes. And it is free.",
      ez: { slips: { 1: "A taxi burns fuel, like a car.", 2: "One car for one person makes lots." } },
      lv: { spicy: { q: "Why is a full bus usually better for the air than lots of cars?",
          options: ["One engine moves lots of people", "Buses do not use any fuel", "Buses go faster than cars"],
          slips: { 1: "Most buses still use fuel or electricity. It is about sharing it.", 2: "Speed is not the point. Buses are often slower." },
          hint: "Think about how many people each engine carries.",
          why: "A full bus might carry 50 people with one engine. That is like taking lots of cars off the road." } } },

    { type: "mc", topic: "Which one for the job?",
      q: "[[Event]] ends at 11pm. The last bus home is at 10.30pm. What is a good plan?",
      options: ["Plan ahead: book a taxi or sort out a lift", "Wait at the stop anyway", "Hope another bus turns up"],
      answer: 0,
      slips: { 1: "If the last bus has gone, waiting will not bring it back.", 2: "After the last bus, no more come until the morning." },
      hint: "The bus has already gone. What else comes to you?",
      why: "When the buses stop, a booked taxi or a lift is the safe way home. Sorting it before you go saves a worry later.",
      ez: { q: "[[Event]] ends at 11pm. The last bus is 10.30pm. What is a good plan?", hint: "What else can come to you?", why: "Book a taxi or a lift before you go.", slips: { 1: "The last bus has gone.", 2: "No more buses until morning." } },
      lv: { spicy: { q: "[[Event]] ends at 11pm. The last train home is at 10.45pm. What are the two sensible choices?",
          options: ["Leave a little early, or book a taxi or lift in advance", "Run for the train after it ends", "Sleep in the station"],
          slips: { 1: "It ends after the train leaves. No amount of running will fix that.", 2: "Not safe or comfy. There are better plans." },
          why: "You can trade a bit of the event for the train, or pay more for a taxi or lift. Weighing that up is the skill." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "What does it cost?", title: "Single, return or day ticket",
      ez: { routes: ["<p><b>Single:</b> one way. <b>Return:</b> there and back.</p><p><b>Day ticket:</b> all day.</p>", "<p>2 singles at &pound;2 is &pound;4. A return is &pound;3.50.</p><p>The <b>return</b> saves 50p.</p>"] },
      routes: [
        { name: "The tickets", fig: TICKETS,
          html: "<p>A <b>single</b> takes you one way. A <b>return</b> takes you there and back. A <b>day ticket</b> lets you hop on and off all day.</p>" +
            "<p>Young people often pay less, so carry proof of your age. The prices here are made up examples: real ones change from place to place.</p>" },
        { name: "Worked example", fig: WORKED,
          html: "<p>A single costs &pound;2. A return costs &pound;3.50.</p>" +
            "<p><b>Step 1:</b> two singles cost &pound;2 + &pound;2 = &pound;4.<br><b>Step 2:</b> compare with the return: &pound;4 take away &pound;3.50 = 50p.<br><b>So</b> the return saves 50p.</p>" }
      ] },

    { type: "num", topic: "What does it cost?", explain: true,
      q: "A bus single costs &pound;2. How much for there and back, using two singles?",
      boxes: [{ label: "Cost", a: 4, pre: "&pound;" }],
      slips: [[2, "That is just one way. You need to come back too."], [6, "That is three singles. There and back is two."]],
      hint: "One single there, one single back.",
      why: "&pound;2 + &pound;2 = <b>&pound;4</b>.",
      ez: { q: "A single is &pound;2. How much for there and back?", slips: [[2, "That is one way. Come back too."], [6, "That is 3 singles. You need 2."]] },
      lv: { medium: { q: "A single costs &pound;2.50. A return costs &pound;4.20. How much do you save with the return?",
          boxes: [{ label: "Saved", a: 0.8, pre: "&pound;" }],
          slips: [[1.7, "That is the return take away one single. Compare the return with <b>two</b> singles."], [5, "That is two singles. Now take away the return."], [0.2, "Check the subtraction: 5.00 take away 4.20."]],
          hint: "Step 1: two singles. Step 2: take away the return.",
          why: "Two singles: &pound;2.50 + &pound;2.50 = &pound;5. Then &pound;5 take away &pound;4.20 = <b>80p</b>." },
        spicy: { q: "A train single is &pound;14.60. A return is &pound;21.50. How much does the return save?",
          boxes: [{ label: "Saved", a: 7.7, pre: "&pound;" }],
          slips: [[6.9, "That is the return take away one single. Compare it with two singles."], [29.2, "That is two singles. Now take away the return."]],
          hint: "Two singles, then take away the return.",
          why: "Two singles: &pound;14.60 x 2 = &pound;29.20. Then &pound;29.20 take away &pound;21.50 = <b>&pound;7.70</b>." } } },

    { type: "num", topic: "What does it cost?",
      q: "You make 3 bus trips today. Each single costs &pound;2. How much do the 3 singles cost altogether?",
      boxes: [{ label: "Three singles", a: 6, pre: "&pound;" }],
      slips: [[5, "Count up in 2s: 2, 4, 6."], [2, "That is just one trip. You make three."]],
      hint: "&pound;2 three times.",
      why: "&pound;2 + &pound;2 + &pound;2 = <b>&pound;6</b>. A day ticket for &pound;5 would save you a pound.",
      ez: { q: "3 bus trips. Each single is &pound;2. What is the total?", slips: [[5, "Count up in 2s: 2, 4, 6."], [2, "That is 1 trip. You make 3."]] },
      lv: { medium: { q: "You make 3 bus trips today. Singles are &pound;2.50 each. A day ticket is &pound;6. How much does the day ticket save?",
          boxes: [{ label: "Saved", a: 1.5, pre: "&pound;" }],
          slips: [[7.5, "That is the three singles. Now take away the day ticket."], [3.5, "That compares the day ticket with one single. Compare it with all three singles."], [0.5, "Three singles cost &pound;7.50, not &pound;6.50."]],
          hint: "Step 1: three singles. Step 2: take away the day ticket.",
          why: "Three singles: &pound;2.50 x 3 = &pound;7.50. Then &pound;7.50 take away &pound;6 = <b>&pound;1.50</b>." },
        spicy: { q: "A train ticket to [[city]] is &pound;24. A young person's discount card takes a third off. What do you pay?",
          boxes: [{ label: "You pay", a: 16, pre: "&pound;" }],
          slips: [[8, "That is the third you save. Take it off the &pound;24."], [21, "That takes off &pound;3, not a third."], [12, "That takes off a half, not a third."]],
          hint: "A third of 24 is 24 divided by 3. Take that off.",
          why: "A third of &pound;24 is &pound;8. &pound;24 take away &pound;8 = <b>&pound;16</b>." } } },

    { type: "mc", topic: "What does it cost?",
      q: "You are going to [[place]] and coming straight back. Which ticket?",
      options: ["A return", "A single", "A day ticket"],
      answer: 0,
      slips: { 1: "A single only gets you there. You need to get home too.", 2: "A day ticket is for lots of trips. You only make two." },
      hint: "There and back.",
      why: "There and back is exactly what a return is for.",
      ez: { q: "Going to [[place]] and straight back. Which ticket?", slips: { 1: "A single only gets you there.", 2: "A day ticket is for lots of trips." } },
      lv: { medium: { q: "You go into town, then on to [[place]], then home. Three trips on the same bus company. Which ticket is likely to be best?",
          options: ["A day ticket", "A return", "One single"],
          slips: { 1: "A return covers two trips. You are making three.", 2: "One single only covers the first trip." },
          hint: "Lots of hops in one day.",
          why: "A day ticket covers as many trips as you like that day, so it is usually best for three or more." },
        spicy: { q: "Off peak train tickets are cheaper but only after about 9.30am on weekdays. You need to be at [[place]] by 2pm on a Tuesday. What is the smart move?",
          options: ["Get an off peak ticket and travel mid morning", "Get the most expensive ticket to be safe", "Travel at 7am to beat the crowds"],
          slips: { 1: "That costs more for no reason. You have loads of time.", 2: "7am is peak time: busier and dearer." },
          hint: "When do you actually need to travel?",
          why: "You do not need to rush, so an off peak ticket after 9.30am gets you there in time for less." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Your trip challenge", title: "Before you go",
      fig: BEFORE,
      ez: { title: "Before you go", html: "<p>Check <b>where and when</b>. Have a <b>ticket</b>. Charge your <b>phone</b>.</p><p>Tell <b>someone</b>. Have a <b>plan B</b>.</p>" },
      html: "<p>A good trip starts before you leave. Check <b>where and when</b>, have a <b>ticket or money</b>, <b>charge your phone</b>, tell <b>someone</b> where you are going, and have a <b>plan B</b>.</p>" +
        "<p>Then there is a challenge to try away from the screen, if you like.</p>" },

    { type: "order", topic: "Your trip challenge",
      q: "Put catching a bus in order.",
      items: ["Check the time and which stop", "Get to the stop a few minutes early", "Hold a hand out when your bus comes", "Pay or show your ticket", "Press the bell before your stop"],
      hint: "Start at home, finish getting off.",
      why: "Plan, wait, signal, pay, then press the bell so the driver knows to stop." },

    { type: "mc", topic: "Your trip challenge",
      q: "Your bus does not turn up. What is a calm first step?",
      options: ["Check for the next one, and text whoever is expecting you", "Give up on buses forever", "Walk off somewhere without telling anyone"],
      answer: 0,
      slips: { 1: "Buses run late sometimes. It happens to everyone, Jay included.", 2: "Someone might worry. Keep them in the loop." },
      hint: "What would help you, and help the people waiting for you?",
      why: "Check the timetable or the sign for the next bus, and let someone know. Most problems shrink once you have a plan B.",
      ez: { hint: "What helps you, and the people waiting?", why: "Check for the next bus. Let someone know.", slips: { 2: "Someone might worry. Let them know." } },
      lv: { spicy: { q: "Your train is cancelled. Which is the most useful first step?",
          options: ["Ask staff or check the board for the next train, and tell whoever is expecting you", "Book an expensive taxi straight away", "Go home without telling anyone"],
          slips: { 1: "Maybe later, but there could be a free next train on your ticket. Check first.", 2: "Someone might be waiting and worried." },
          why: "Staff and the boards will tell you the next train, and your ticket often still works on it. Then update whoever is waiting." } } },

    { type: "widget", topic: "Your trip challenge", unscored: true,
      title: "Trip challenge",
      html: "<p>Pick a challenge for away from the screen, and tick things off whenever you do them.</p>",
      ez: { html: "<p>Pick a challenge. Tick things off when you do them.</p>" },
      mount: tripWidget,
      report: function(d){ if(!d || !d.pick) return ""; var c = CH.filter(function(x){ return x.id === d.pick; })[0]; var t = (d.ticks && d.ticks[d.pick]) || []; var n = t.filter(Boolean).length; return c ? "Trip challenge (" + c.name + "): " + n + " of " + c.ticks.length + " ticked." : ""; } },

    { type: "write", topic: "Your trip challenge",
      q: "After your challenge, or about a trip you have done before, tell Jay how it went, if you like. Where did you go, how did you get there, and what would you do the same next time?",
      starters: ["I went to", "I got there by", "It cost", "Next time I would"],
      checklist: ["Where I went", "The transport I used", "What it cost, if I know", "One thing for next time"],
      minWords: 25,
      ez: { q: "Only if you like: tell Jay about a trip. How did you get there?" } }
  ],

  realWorld: {
    title: "Getting around opens doors",
    html: "<p>College, work, the doctor, seeing friends: being able to get there on your own means more choices about your life.</p>" +
      "<p>For our big question: before trains, most people hardly ever went far from the town they were born in. Trains changed that in a few years. If we could time travel, should we? Someone from 1800 would think a bus pass was magic.</p>",
    fig: '<svg viewBox="0 0 420 150" role="img" aria-label="A train coming out of a time portal, with Jay watching">' + A2ART.portal(90, 75, 60) +
      '<g transform="translate(170 104) scale(1.1)">' + ICON.train + '</g>' + A2ART.jay(330, 50, 0.8, "wow") + '</svg>'
  },

  ez: {
    realWorld: { title: "Getting around opens doors", html: "<p>College, work, friends: getting there means more choices.</p><p>Someone from 1800 would think a bus pass was magic!</p>" },
    make: { intro: "Make a ticket for a trip. Keep it, or send it to Jay." }
  },

  make: {
    title: "Make a journey ticket",
    intro: "A ticket for a trip you have done or would like to do. Keep it, or send it to Jay.",
    fields: [
      { id: "from", label: "From", ph: "Base 5", max: 28 },
      { id: "to", label: "To", ph: "The seaside", max: 28 },
      { id: "how", label: "How I would get there", ph: "Bus, then a train", max: 40 },
      { id: "cost", label: "Ticket and cost", ph: "Return, about 12 pounds", max: 36 },
      { id: "name", label: "Passenger", ph: "The Explorer", max: 24 }
    ],
    svg: function(v){
      var fr = wrap(v.from, 13, 2), to = wrap(v.to, 13, 2), how = wrap(v.how, 34, 2), cost = wrap(v.cost, 34, 2), nm = wrap(v.name, 12, 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 380">' +
        '<path d="M20 20h600v140a30 30 0 0 0 0 60v140h-600v-140a30 30 0 0 0 0 -60z" fill="#fffbe0" stroke="#141a33" stroke-width="4"/>' +
        '<rect x="20" y="20" width="600" height="56" fill="#e04848"/><path d="M20 20h600v56h-600z" fill="none" stroke="#141a33" stroke-width="4"/>' +
        T(44, 58, "JOURNEY TICKET", 26, { b: 1, c: "#ffffff" }) + T(596, 58, "ADMIT ONE", 16, { b: 1, a: "end", c: "#ffffff" }) +
        '<path d="M470 76v284" stroke="#141a33" stroke-width="3" stroke-dasharray="10 8"/>' +
        T(44, 110, "FROM", 14, { b: 1, c: "#5b6180" }) + fr.map(function(l, k){ return T(44, 138 + k * 26, esc(l), 20, { b: 1 }); }).join("") +
        '<path d="M228 128h34" stroke="#141a33" stroke-width="4"/><path d="M258 118l14 10 -14 10z" fill="#141a33"/>' +
        T(284, 110, "TO", 14, { b: 1, c: "#5b6180" }) + to.map(function(l, k){ return T(284, 138 + k * 26, esc(l), 20, { b: 1 }); }).join("") +
        T(44, 220, "TRAVEL BY", 14, { b: 1, c: "#5b6180" }) + how.map(function(l, k){ return T(44, 244 + k * 22, esc(l), 16); }).join("") +
        T(44, 298, "TICKET", 14, { b: 1, c: "#5b6180" }) + cost.map(function(l, k){ return T(44, 322 + k * 22, esc(l), 16); }).join("") +
        T(545, 110, "PASSENGER", 13, { b: 1, a: "middle", c: "#5b6180" }) + nm.map(function(l, k){ return T(545, 136 + k * 22, esc(l), 15, { b: 1, a: "middle" }); }).join("") +
        '<g transform="translate(545 236) scale(.8)">' + ICON.bus + '</g>' +
        '<g transform="translate(545 314) rotate(-10)"><circle r="30" fill="none" stroke="#1f9d63" stroke-width="4"/>' + T(0, 6, "GO", 18, { b: 1, a: "middle", c: "#1f9d63" }) + '</g>' +
        '</svg>';
    }
  }
};
})();
