/* Base 5 Autumn 2 activity: Kit it out.
   Maths. How many panels or packs to buy (round up), what it costs,
   and keeping to a budget. ASCII only. */
(function(){
var A = window.A2ART;
var F = 'font-family="Verdana,Arial,sans-serif"';
var M2 = "m&#178;", PD = "&#163;";

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function money(n){ return Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : n.toFixed(2); }

/* fencing: 9 m of fence, 2 m panels, the fifth panel sticks out */
var FENCE = (function(){
  var s = 45, x0 = 40, gy = 150;
  var out = '<svg viewBox="0 0 520 230" role="img" aria-label="A 9 metre fence needs 4 and a half panels of 2 metres, so you buy 5">' +
    '<rect x="0" y="0" width="520" height="230" rx="16" fill="#eaf6ee"/>' +
    '<rect x="0" y="' + gy + '" width="520" height="80" fill="#9bd27a"/>';
  for(var k = 0; k < 5; k++){
    var x = x0 + k * 2 * s, last = k === 4;
    out += '<rect x="' + x + '" y="70" width="' + (2 * s) + '" height="80" fill="' + (last ? "none" : "#c99a63") + '" stroke="' + (last ? "#e08a00" : "#7a5532") + '" stroke-width="3"' + (last ? ' stroke-dasharray="8 6"' : '') + '/>';
    if(!last) for(var j = 1; j < 6; j++) out += '<path d="M' + (x + j * 15) + ' 72v76" stroke="#7a5532" stroke-width="2"/>';
    out += '<text x="' + (x + s) + '" y="62" text-anchor="middle" ' + F + ' font-size="14" fill="#141a33">2 m</text>';
  }
  out += '<path d="M' + x0 + ' 176h' + (9 * s) + 'M' + x0 + ' 168v16M' + (x0 + 9 * s) + ' 168v16" stroke="#141a33" stroke-width="2.5"/>' +
    '<text x="' + (x0 + 4.5 * s) + '" y="200" text-anchor="middle" ' + F + ' font-size="16" font-weight="700" fill="#141a33">the fence is 9 m long</text>' +
    '<path d="M' + (x0 + 9 * s) + ' 70v80" stroke="#141a33" stroke-width="3"/>' +
    '<text x="505" y="40" text-anchor="end" ' + F + ' font-size="14" font-weight="700" fill="#e08a00">part of a 5th panel</text>' +
    A.egg(A.bird(150, 60, 0.6, "#3a8fd6"), "A bird on the fence. Jay counts it as a fence inspector.") +
    '</svg>';
  return out;
})();

/* flooring: a 4 m by 3 m floor and packs that cover 2.5 m2 */
function floorFig(w, l, cover, packs, o){
  o = o || {};
  var s = 40, x0 = 30, y0 = 34, need = o.need || w * l, used = need / cover;
  var out = '<svg viewBox="0 0 520 250" role="img" aria-label="A floor ' + w + ' m by ' + l + ' m, and the packs it needs">' +
    '<rect x="0" y="0" width="520" height="250" rx="16" fill="#f4f1ea"/>' +
    '<rect x="' + x0 + '" y="' + y0 + '" width="' + (w * s) + '" height="' + (l * s) + '" fill="#ffe7b8" stroke="#141a33" stroke-width="3"/>';
  for(var i = 1; i < w; i++) out += '<path d="M' + (x0 + i * s) + ' ' + y0 + 'v' + (l * s) + '" stroke="#c99a63" stroke-width="1.5"/>';
  for(var j = 1; j < l; j++) out += '<path d="M' + x0 + ' ' + (y0 + j * s) + 'h' + (w * s) + '" stroke="#c99a63" stroke-width="1.5"/>';
  out += '<text x="' + (x0 + w * s / 2) + '" y="' + (y0 - 10) + '" text-anchor="middle" ' + F + ' font-size="14" fill="#141a33">' + w + ' m</text>' +
    '<text x="' + (x0 + w * s + 8) + '" y="' + (y0 + l * s / 2 + 5) + '" ' + F + ' font-size="14" fill="#141a33">' + l + ' m</text>' +
    '<text x="' + (x0 + w * s / 2) + '" y="' + (y0 + l * s / 2 + 8) + '" text-anchor="middle" ' + F + ' font-size="20" font-weight="700" fill="#141a33">' + (w * l) + ' ' + M2 + '</text>' +
    A.bonnie(x0 + 30, y0 + l * s - 26, 0.4, "sit");
  var px = 260 + 0;
  out += '<text x="' + px + '" y="40" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + (o.label || "1 pack covers " + cover + " " + M2) + '</text>';
  for(var k = 0; k < packs; k++){
    var bx = px + (k % 4) * 60, by = 56 + Math.floor(k / 4) * 70, part = Math.min(1, Math.max(0, used - k));
    out += '<rect x="' + bx + '" y="' + by + '" width="48" height="58" rx="6" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
      '<rect x="' + (bx + 3) + '" y="' + (by + 3 + 52 * (1 - part)) + '" width="42" height="' + (52 * part) + '" rx="3" fill="#22b8e6"/>';
  }
  out += '<text x="' + px + '" y="' + (70 + Math.ceil(packs / 4) * 70) + '" ' + F + ' font-size="14" fill="#141a33">' + need + ' &#247; ' + cover + ' = ' + (Math.round(used * 100) / 100) + ', so buy ' + packs + '</text>' +
    '<text x="' + px + '" y="' + (90 + Math.ceil(packs / 4) * 70) + '" ' + F + ' font-size="13" fill="#5b6180">the last pack is only partly used</text>' +
    '</svg>';
  return out;
}

/* a receipt */
var RECEIPT =
  '<svg viewBox="0 0 520 240" role="img" aria-label="A receipt: 5 packs at 18 pounds 50 is 92 pounds 50, plus glue at 7 pounds, total 99 pounds 50">' +
  '<rect x="0" y="0" width="520" height="240" rx="16" fill="#e8f7ff"/>' +
  '<path d="M120 14h280v200l-14 10 -14 -10 -14 10 -14 -10 -14 10 -14 -10 -14 10 -14 -10 -14 10 -14 -10 -14 10 -14 -10 -14 10 -14 -10 -14 10 -14 -10 -14 10 -14 -10 -14 10 -14 -10z" fill="#fff" stroke="#141a33" stroke-width="2.5"/>' +
  '<text x="260" y="42" text-anchor="middle" ' + F + ' font-size="15" font-weight="700" fill="#141a33">RECEIPT</text>' +
  '<text x="140" y="76" ' + F + ' font-size="15" fill="#141a33">5 packs x ' + PD + '18.50</text><text x="384" y="76" text-anchor="end" ' + F + ' font-size="15" fill="#141a33">' + PD + '92.50</text>' +
  '<text x="140" y="104" ' + F + ' font-size="15" fill="#141a33">1 tub of glue</text><text x="384" y="104" text-anchor="end" ' + F + ' font-size="15" fill="#141a33">' + PD + '7.00</text>' +
  '<path d="M140 124h244" stroke="#141a33" stroke-width="2" stroke-dasharray="5 4"/>' +
  '<text x="140" y="154" ' + F + ' font-size="17" font-weight="700" fill="#141a33">TOTAL</text><text x="384" y="154" text-anchor="end" ' + F + ' font-size="17" font-weight="700" fill="#141a33">' + PD + '99.50</text>' +
  '<text x="260" y="190" text-anchor="middle" ' + F + ' font-size="13" fill="#5b6180">packs x price, then add it all up</text>' +
  A.egg('<g transform="translate(450 120) rotate(-20)"><rect x="-22" y="-6" width="44" height="12" rx="6" fill="#fff" stroke="#141a33" stroke-width="2"/><circle cx="-22" cy="-6" r="7" fill="#fff" stroke="#141a33" stroke-width="2"/><circle cx="-22" cy="6" r="7" fill="#fff" stroke="#141a33" stroke-width="2"/><circle cx="22" cy="-6" r="7" fill="#fff" stroke="#141a33" stroke-width="2"/><circle cx="22" cy="6" r="7" fill="#fff" stroke="#141a33" stroke-width="2"/></g>', "Bonnie's chew bone. Not in the budget, sadly. She has appealed.") +
  '</svg>';

/* the budget bar */
var BUDGET = (function(){
  var x0 = 30, wd = 460, B = 150, parts = [["Flooring", 92.5, "#22b8e6"], ["Paint", 24, "#ff5d8f"], ["Lights", 30, "#ffd23f"]];
  var out = '<svg viewBox="0 0 520 200" role="img" aria-label="A budget of 150 pounds: flooring 92.50, paint 24, lights 30, and 3.50 left over">' +
    '<rect x="0" y="0" width="520" height="200" rx="16" fill="#f4f1ea"/>' +
    '<text x="30" y="34" ' + F + ' font-size="16" font-weight="700" fill="#141a33">Budget: ' + PD + '150</text>' +
    '<rect x="' + x0 + '" y="50" width="' + wd + '" height="54" rx="10" fill="#fff" stroke="#141a33" stroke-width="3"/>';
  var x = x0;
  parts.forEach(function(p, k){
    var w = wd * p[1] / B;
    out += '<rect x="' + x + '" y="50" width="' + w + '" height="54" fill="' + p[2] + '" stroke="#141a33" stroke-width="2"/>' +
      '<text x="' + (x + w / 2) + '" y="82" text-anchor="middle" ' + F + ' font-size="14" font-weight="700" fill="#141a33">' + p[0] + '</text>' +
      '<text x="' + (x + w / 2) + '" y="128" text-anchor="middle" ' + F + ' font-size="13" fill="#141a33">' + PD + money(p[1]) + '</text>';
    x += w;
  });
  out += '<path d="M' + (x + 5) + ' 110v40" stroke="#1f9d63" stroke-width="2.5"/><text x="' + (x - 4) + '" y="170" text-anchor="end" ' + F + ' font-size="14" font-weight="700" fill="#1f9d63">left over: ' + PD + '3.50</text>' +
    '</svg>';
  return out;
})();

/* the kit planner widget */
function planner(el, api){
  var d = api.data, lv = api.level || "medium";
  var spicy = lv === "spicy", step = spicy ? 0.5 : 1;
  var budget = { mild: 100, medium: 150, spicy: 160 }[lv] || 150;
  var floor = api.tok("[[Floor]]");
  var packs = [["Standard pack", 2.5, 18], ["Big pack", 4, 26], ["Value pack", 1.5, 10]];
  if(d.w == null){ d.w = spicy ? 5 : 4; d.l = spicy ? 4 : 3; d.p = 0; }
  el.innerHTML = '<div class="kp-ctl" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:6px 0"></div>' +
    '<div class="kp-packs" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0"></div>' +
    '<div class="kp-fig"></div><p class="kp-msg" style="margin-top:8px"></p>';
  var ctl = el.querySelector(".kp-ctl"), pk = el.querySelector(".kp-packs"), fig = el.querySelector(".kp-fig"), msg = el.querySelector(".kp-msg");
  function btn(txt, fn, label){
    var b = document.createElement("button");
    b.type = "button"; b.textContent = txt;
    if(label) b.setAttribute("aria-label", label);
    b.style.cssText = "font:inherit;font-weight:700;min-width:40px;padding:6px 10px;border-radius:10px;border:2px solid #141a33;background:#fff;color:#141a33;cursor:pointer";
    b.onclick = function(){ fn(); d.used = true; api.save(); draw(); api.done("done"); };
    return b;
  }
  [["w", "Width"], ["l", "Length"]].forEach(function(c){
    var wrap = document.createElement("span");
    wrap.style.cssText = "display:inline-flex;gap:6px;align-items:center;font-weight:700";
    wrap.appendChild(document.createTextNode(c[1] + " "));
    wrap.appendChild(btn("-", function(){ d[c[0]] = Math.max(1, d[c[0]] - step); }, c[1] + " smaller"));
    var v = document.createElement("span"); v.className = "kp-" + c[0]; v.style.minWidth = "48px"; v.style.textAlign = "center";
    wrap.appendChild(v);
    wrap.appendChild(btn("+", function(){ d[c[0]] = Math.min(8, d[c[0]] + step); }, c[1] + " bigger"));
    ctl.appendChild(wrap);
  });
  var pb = packs.map(function(p, k){
    var b = btn(p[0] + ": " + p[1] + " m2, \u00a3" + p[2], function(){ d.p = k; });
    b.textContent = p[0] + ": covers " + p[1] + " m\u00b2 for \u00a3" + p[2];
    pk.appendChild(b);
    return b;
  });
  function draw(){
    var w = d.w, l = d.l, area = w * l, need = spicy ? area * 1.1 : area, p = packs[d.p] || packs[0];
    var n = Math.ceil(need / p[1] - 1e-9), cost = n * p[2], left = budget - cost;
    el.querySelector(".kp-w").textContent = w + " m";
    el.querySelector(".kp-l").textContent = l + " m";
    pb.forEach(function(b, k){ b.style.background = k === d.p ? "#ffd23f" : "#fff"; b.setAttribute("aria-pressed", k === d.p ? "true" : "false"); });
    var s = Math.min(36, 220 / Math.max(w, l)), x0 = 20, y0 = 20, gl = "";
    for(var i = 1; i < w; i++) gl += '<path d="M' + (x0 + i * s) + ' ' + y0 + 'v' + (l * s) + '" stroke="#c99a63" stroke-width="1"/>';
    for(var j = 1; j < l; j++) gl += '<path d="M' + x0 + ' ' + (y0 + j * s) + 'h' + (w * s) + '" stroke="#c99a63" stroke-width="1"/>';
    var bw = 200, fill = Math.min(1, cost / budget);
    var lines = [
      "Area: " + w + " x " + l + " = " + (Math.round(area * 100) / 100) + " m\u00b2",
      spicy ? "With 10% extra: " + (Math.round(need * 100) / 100) + " m\u00b2" : "",
      "Packs: " + (Math.round(need / p[1] * 100) / 100) + ", so buy " + n,
      "Cost: " + n + " x \u00a3" + p[2] + " = \u00a3" + money(cost)
    ].filter(Boolean);
    fig.innerHTML = '<svg viewBox="0 0 520 280" role="img" aria-label="Your room plan and what it costs">' +
      '<rect x="0" y="0" width="520" height="280" rx="14" fill="#f4f1ea"/>' +
      '<rect x="' + x0 + '" y="' + y0 + '" width="' + (w * s) + '" height="' + (l * s) + '" fill="#ffe7b8" stroke="#141a33" stroke-width="2.5"/>' + gl +
      '<text x="' + x0 + '" y="' + (y0 + l * s + 20) + '" ' + F + ' font-size="13" fill="#141a33">' + esc(floor) + '</text>' +
      lines.map(function(t, k){ return '<text x="270" y="' + (40 + k * 26) + '" ' + F + ' font-size="15" fill="#141a33">' + esc(t) + '</text>'; }).join("") +
      '<text x="270" y="186" ' + F + ' font-size="14" font-weight="700" fill="#141a33">Budget \u00a3' + budget + '</text>' +
      '<rect x="270" y="196" width="' + bw + '" height="26" rx="8" fill="#fff" stroke="#141a33" stroke-width="2"/>' +
      '<rect x="272" y="198" width="' + Math.max(0, (bw - 4) * fill) + '" height="22" rx="6" fill="' + (left >= 0 ? "#19c39a" : "#ff9f43") + '"/>' +
      '<text x="270" y="248" ' + F + ' font-size="15" font-weight="700" fill="' + (left >= 0 ? "#1f7a4d" : "#a85a00") + '">' + (left >= 0 ? "\u00a3" + money(left) + " left over" : "Over by \u00a3" + money(-left)) + '</text>' +
      '</svg>';
    msg.textContent = left >= 0 ? "That fits the budget. Try a different pack: is there a cheaper way to do the same floor?" :
      "Over budget. A smaller room or a different pack might bring it back under. Have a play.";
  }
  draw();
  if(d.used) api.done("done");
}

(window.A2PACKS = window.A2PACKS || {})["kit-it-out"] = {
  a2: true,
  id: "a2-kit-it-out",
  title: "Kit it out",
  subject: "Maths",
  bodyClass: "subj-maths",
  mins: 25,
  line: "How many to buy, what it costs, and whether it fits the budget.",
  blurb: "Working out the materials for a design: how many panels or packs to buy, what it all costs, and keeping to a budget. Four short chunks, a room planner to play with, and a kit list to make at the end.",
  note: "Kit it out: working out what to buy for a design and what it costs, then keeping it on budget. Four five minute chunks and a kit list to make at the end. Have a look whenever you fancy it.",
  sure: true,
  levels: [
    { id: "mild", name: "Odd jobs", line: "Odd jobs: whole numbers, simple packs and prices." },
    { id: "medium", name: "Fitter", line: "Fitter: areas, packs that do not divide neatly, and prices with pence." },
    { id: "spicy", name: "Site manager", line: "Site manager: extra for waste, comparing packs for best value, and tight budgets." }
  ],
  themes: {
    time: { name: "Time travel", w: { room: "the time machine workshop", fence: "the launch pad", floor: "rubber floor tiles" } },
    football: { name: "Football", w: { room: "the changing room", fence: "the training pitch", floor: "artificial grass" } },
    horror: { name: "Horror", w: { room: "the night shift staff room", fence: "the graveyard set", floor: "dark floorboards" } },
    fishing: { name: "Fishing", w: { room: "the tackle shed", fence: "the riverbank path", floor: "non slip decking" } },
    music: { name: "Music", w: { room: "the rehearsal studio", fence: "the outdoor stage", floor: "carpet tiles" } }
  },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: FENCE,
  steps: [

    /* ---------- chunk 1 ---------- */
    { type: "learn", topic: "How many do I need?", title: "Divide, then round up",
      ez: { title: "Divide, then round up", html: "<p>9 m fence. 2 m panels. 9 &#247; 2 = 4.5.</p><p>No half panels. <b>Round up</b> to 5.</p>" },
      fig: FENCE,
      html: "<p>A new fence is going round [[fence]]. One side is <b>9 m</b> long. Fence panels are <b>2 m</b> wide.</p>" +
        "<p class=\"a2task\"><b>Worked example</b><br>9 &#247; 2 = 4.5 panels<br>You cannot buy half a panel, so <b>round up</b>: buy <b>5 panels</b>.</p>" +
        "<p>Rounding down to 4 would leave a 1 m gap. When you are buying materials, any part left over means <b>one more</b>.</p>",
      lv: { mild: { html: "<p>A new fence is going round [[fence]]. Fence panels are <b>2 m</b> wide.</p>" +
              "<p class=\"a2task\"><b>Worked example 1</b><br>An 8 m fence: 8 &#247; 2 = 4. Buy <b>4 panels</b>.</p>" +
              "<p class=\"a2task\"><b>Worked example 2</b><br>A 9 m fence: 9 &#247; 2 = 4.5. You cannot buy half a panel, so buy <b>5 panels</b>.</p>" +
              "<p>If the answer is not a whole number, buy <b>one more</b>. That is called rounding up.</p>" },
            spicy: { html: "<p>A new fence is going round [[fence]]. One side is <b>9 m</b>. Panels are <b>2 m</b> wide.</p>" +
              "<p class=\"a2task\"><b>Worked example</b><br>9 &#247; 2 = 4.5 panels, so buy <b>5</b>.<br>Posts: one at each end of every panel, shared in between, so 5 panels need 5 + 1 = <b>6 posts</b>.</p>" +
              "<p>For materials, you <b>always round up</b>, even 4.1 becomes 5. This is not normal rounding: it is \"do I have enough?\"</p>" } } },

    { type: "num", topic: "How many do I need?",
      q: "A fence is <b>11 m</b> long. Panels are <b>2 m</b> wide. How many panels do you need to buy?",
      boxes: [{ label: "Panels", a: 6 }],
      slips: [[5.5, "That is the exact answer. You cannot buy half a panel, so round up."], [5, "5 panels only cover 10 m, which leaves a gap. Round up."]],
      hint: "Work out 11 &#247; 2, then round up.",
      why: "11 &#247; 2 = 5.5, so buy <b>6 panels</b>.",
      ez: { q: "<b>8 m</b> fence. <b>2 m</b> panels. How many panels?", why: "8 &#247; 2 = <b>4 panels</b>. Nothing left over.",
        slips: [[16, "That is 8 times 2. Divide instead."], [6, "Count in 2s to 8. How many 2s?"]] },
      lv: { mild: { q: "A fence is <b>8 m</b> long. Panels are <b>2 m</b> wide. How many panels do you need?",
              boxes: [{ label: "Panels", a: 4 }],
              slips: [[16, "That is 8 times 2. Share the 8 m out into 2 m pieces instead: divide."], [6, "Count in twos up to 8: 2, 4, 6, 8. How many twos?"]],
              hint: "How many 2s make 8?",
              why: "8 &#247; 2 = <b>4 panels</b>. No part left over, so no rounding needed." },
            spicy: { q: "A fence is <b>13.5 m</b> long. Panels are <b>1.8 m</b> wide. How many panels do you need to buy?",
              boxes: [{ label: "Panels", a: 8 }],
              slips: [[7.5, "That is the exact answer. Round up to whole panels."], [7, "7 panels cover 12.6 m, which leaves a gap."]],
              hint: "Work out 13.5 &#247; 1.8, then round up.",
              why: "13.5 &#247; 1.8 = 7.5, so buy <b>8 panels</b>." } } },

    { type: "mc", topic: "How many do I need?",
      q: "Why do we round <b>up</b> when buying panels?",
      options: ["Rounding down would leave a gap.", "Because a half always rounds up.", "Because shops only sell even numbers."],
      answer: 0,
      slips: { 1: "That is the normal rounding rule, but here even 4.1 panels would mean buying 5.", 2: "Shops will sell you any number. The reason is about the fence." },
      hint: "Picture the fence with one panel missing.",
      why: "Any part of a panel that is needed means buying one more, or the fence has a gap.",
      ez: { why: "Rounding down leaves a <b>gap</b> in the fence.", slips: { 1: "Even 4.1 panels means buying 5.", 2: "Shops sell any number. Think about the fence." } },
      lv: { spicy: { q: "You work out you need <b>6.1</b> panels. How many do you buy?",
        options: ["7", "6", "6.1"], fixed: true,
        slips: { 1: "Normal rounding says 6, but 6 panels leave a gap. Any part of a panel means one more.", 2: "You cannot buy a tenth of a panel." },
        hint: "Is 6 panels enough?",
        why: "6 is not quite enough, so buy <b>7</b>. For materials you round up, even from 6.1." } } },

    { type: "num", topic: "How many do I need?",
      q: "Your turn, with the steps laid out. A fence is <b>14 m</b> long. Panels are <b>3 m</b> wide.",
      boxes: [{ label: "14 &#247; 3 =", a: 4.67, tol: 0.07, alts: [4.6] }, { label: "Panels to buy", a: 5 }],
      slips: [[1, 4, "4 panels only cover 12 m. Round up."], [0, 42, "That is 14 times 3. Divide instead."]],
      hint: "Divide first. Then ask: is that enough panels?",
      why: "14 &#247; 3 = 4.67 (to 2 decimal places), so buy <b>5 panels</b>.",
      ez: { q: "Your turn. <b>7 m</b> fence. <b>2 m</b> panels.", hint: "Half of 7. Is it whole?",
        slips: [[1, 3, "3 panels leave a gap. Round up."], [0, 14, "That is 7 times 2. Divide instead."]] },
      lv: { mild: { q: "Your turn, with the steps laid out. A fence is <b>7 m</b> long. Panels are <b>2 m</b> wide.",
              boxes: [{ label: "7 &#247; 2 =", a: 3.5 }, { label: "Panels to buy", a: 4 }],
              slips: [[1, 3, "3 panels only cover 6 m, which leaves a gap. Round up."], [0, 14, "That is 7 times 2. Share it out instead: divide."]],
              hint: "Half of 7 first. Then: is that a whole number?",
              why: "7 &#247; 2 = 3.5, so buy <b>4 panels</b>." },
            spicy: { q: "Now the posts. A fence has <b>8 panels</b> in a straight line, with a post at each end of every panel (posts are shared where panels meet). How many posts?",
              boxes: [{ label: "Posts", a: 9 }],
              slips: [[8, "Count the posts on the end: one more than the panels."], [16, "Neighbouring panels share a post, so you do not need two each."]],
              hint: "Draw 2 panels: how many posts? Then 3?",
              why: "Panels plus one: 8 + 1 = <b>9 posts</b>." } } },

    /* ---------- chunk 2 ---------- */
    { type: "learn", topic: "Packs and rounding up", title: "Floors: area, then packs",
      fig: floorFig(4, 3, 2.5, 5),
      ez: { title: "Floors: tiles, then packs", html: "<p>3 x 2 = <b>6 tiles</b>.</p><p>Packs of 4. 6 &#247; 4 = 1.5. Buy <b>2 packs</b>.</p>" },
      html: "<p>New flooring for [[room]]: [[floor]]. It comes in packs, and each pack covers <b>2.5 " + M2 + "</b>.</p>" +
        "<p class=\"a2task\"><b>Worked example</b>: a room 4 m by 3 m<br>Step 1, area: 4 x 3 = <b>12 " + M2 + "</b><br>Step 2, packs: 12 &#247; 2.5 = 4.8<br>Step 3, round up: buy <b>5 packs</b></p>",
      lv: { mild: { fig: floorFig(3, 2, 4, 2, { label: "1 pack = 4 tiles" }),
              html: "<p>New flooring for [[room]]: [[floor]]. Each tile covers <b>1 " + M2 + "</b>, and tiles come in <b>packs of 4</b>.</p>" +
              "<p class=\"a2task\"><b>Worked example</b>: a room 3 m by 2 m<br>Step 1, tiles: 3 x 2 = <b>6 tiles</b><br>Step 2, packs: 6 &#247; 4 = 1.5<br>Step 3, round up: buy <b>2 packs</b></p>" },
            spicy: { fig: floorFig(4, 3, 2.5, 6, { need: 13.2 }), html: "<p>New flooring for [[room]]: [[floor]]. Each pack covers <b>2.5 " + M2 + "</b>. Fitters add <b>10% extra</b> for cutting and mistakes.</p>" +
              "<p class=\"a2task\"><b>Worked example</b>: a room 4 m by 3 m<br>Step 1, area: 4 x 3 = 12 " + M2 + "<br>Step 2, add 10%: 12 x 1.1 = <b>13.2 " + M2 + "</b><br>Step 3, packs: 13.2 &#247; 2.5 = 5.28<br>Step 4, round up: buy <b>6 packs</b></p>" +
              "<p>Without the extra you would have bought 5, and run out on the last cut.</p>" } } },

    { type: "num", topic: "Packs and rounding up",
      q: "Some steps left for you. A room is <b>5 m by 3 m</b>. Each pack covers <b>2 " + M2 + "</b>.",
      boxes: [{ label: "Area", a: 15, post: M2 }, { label: "15 &#247; 2 =", a: 7.5 }, { label: "Packs to buy", a: 8 }],
      slips: [[0, 16, "That is the perimeter, the distance round the edge. Area is length times width."], [0, 8, "That is 5 + 3. Area is 5 x 3."], [2, 7, "7 packs cover 14 " + M2 + ", not quite enough. Round up."]],
      hint: "Area first: length x width. Then divide by what one pack covers.",
      why: "5 x 3 = 15 " + M2 + ". 15 &#247; 2 = 7.5, so buy <b>8 packs</b>.",
      ez: { q: "Room: <b>4 m by 2 m</b>. 1 tile per " + M2 + ". <b>Packs of 3</b>.", hint: "Tiles: 4 x 2. Then packs of 3.", why: "8 tiles. 2 packs is 6. So buy <b>3 packs</b>.",
        slips: [[0, 6, "That is 4 + 2. Try 4 x 2."], [1, 2, "2 packs is only 6 tiles."]] },
      lv: { mild: { q: "Some steps left for you. A room is <b>4 m by 2 m</b>. Each tile covers 1 " + M2 + ". Tiles come in <b>packs of 3</b>.",
              boxes: [{ label: "Tiles needed", a: 8 }, { label: "Packs to buy", a: 3 }],
              slips: [[0, 6, "That is 4 + 2. Count the squares: 4 rows of 2."], [1, 2, "2 packs is only 6 tiles. You need 8."]],
              hint: "Tiles: 4 x 2. Then how many packs of 3 to get at least that many?",
              why: "4 x 2 = 8 tiles. 2 packs give 6, not enough, so buy <b>3 packs</b>." },
            spicy: { q: "Some steps left for you. A room is <b>5 m by 4 m</b>. Add <b>10% extra</b>. Each pack covers <b>2.4 " + M2 + "</b>.",
              boxes: [{ label: "Area with 10% extra", a: 22, post: M2 }, { label: "Packs to buy", a: 10 }],
              slips: [[0, 20, "That is the area before the extra. Add 10%: times by 1.1."], [0, 30, "Ten percent of 20 is 2, not 10."], [1, 9, "9 packs cover 21.6 " + M2 + ", just short of 22."], [1, 9.17, "Round that up to whole packs."]],
              hint: "20 " + M2 + " plus 10%, then divide by 2.4 and round up.",
              why: "20 x 1.1 = 22 " + M2 + ". 22 &#247; 2.4 = 9.17, so buy <b>10 packs</b>." } } },

    { type: "num", topic: "Packs and rounding up", explain: true,
      q: "On your own now. A room is <b>6 m by 3.5 m</b>. Each pack covers <b>2.5 " + M2 + "</b>. How many packs?",
      boxes: [{ label: "Packs", a: 9 }],
      slips: [[8.4, "That is the exact number. Round up to whole packs."], [8, "8 packs cover 20 " + M2 + ", but the room is 21 " + M2 + "."], [19, "That is the perimeter. Use the area: 6 x 3.5."]],
      hint: "Area first, then divide by 2.5, then round up.",
      why: "6 x 3.5 = 21 " + M2 + ". 21 &#247; 2.5 = 8.4, so buy <b>9 packs</b>.",
      ez: { q: "Room: <b>5 m by 2 m</b>. 1 tile per " + M2 + ". <b>Packs of 4</b>. How many packs?",
        slips: [[2.5, "Round up to whole packs."], [2, "2 packs is only 8 tiles. You need 10."], [10, "That is the tiles. Now packs of 4."]] },
      lv: { mild: { q: "On your own now. A room is <b>5 m by 2 m</b>. Each tile covers 1 " + M2 + ". Tiles come in <b>packs of 4</b>. How many packs?",
              boxes: [{ label: "Packs", a: 3 }],
              slips: [[2.5, "Round up to whole packs."], [2, "2 packs is only 8 tiles. The room needs 10."], [10, "That is the number of tiles. Now share them into packs of 4."]],
              hint: "Tiles: 5 x 2. Then packs of 4.",
              why: "5 x 2 = 10 tiles. 10 &#247; 4 = 2.5, so buy <b>3 packs</b>." },
            spicy: { q: "On your own now. A room is <b>6 m by 4 m</b>, but a <b>3 m by 1 m</b> cupboard is not floored. Add <b>10% extra</b>. Packs cover <b>2.4 " + M2 + "</b>. How many packs?",
              boxes: [{ label: "Packs", a: 10 }],
              slips: [[9, "9 packs cover 21.6 " + M2 + ", short of the 23.1 you need. Did you add the 10%?"], [11, "Did you leave the cupboard in? Take its 3 " + M2 + " off first."], [9.63, "Round up to whole packs."], [9.625, "Round up to whole packs."]],
              hint: "Room area, take off the cupboard, add 10%, divide by 2.4, round up.",
              why: "24 - 3 = 21 " + M2 + ". 21 x 1.1 = 23.1. 23.1 &#247; 2.4 = 9.63, so buy <b>10 packs</b>." } } },

    { type: "mc", topic: "Packs and rounding up",
      q: "A pack covers <b>2.5 " + M2 + "</b>. You need exactly <b>10 " + M2 + "</b>. How many packs?",
      options: ["4", "5", "3"], answer: 0, fixed: true,
      slips: { 1: "10 &#247; 2.5 is exactly 4. No part pack, so nothing to round up.", 2: "3 packs only cover 7.5 " + M2 + "." },
      hint: "Work out 10 &#247; 2.5. Is it a whole number?",
      why: "10 &#247; 2.5 = 4 exactly. Only round up when there is a part pack.",
      ez: { q: "<b>Packs of 4</b>. You need <b>12 tiles</b>. How many packs?", slips: { 1: "12 &#247; 4 is exactly 3. No rounding up." } },
      lv: { mild: { q: "Tiles come in <b>packs of 4</b>. You need exactly <b>12 tiles</b>. How many packs?",
              options: ["3", "4", "2"],
              slips: { 1: "12 &#247; 4 is exactly 3. Nothing left over, so no rounding up.", 2: "2 packs is only 8 tiles." },
              hint: "Count in 4s up to 12.", why: "4, 8, 12: exactly <b>3 packs</b>." },
            spicy: { q: "You need <b>12 " + M2 + " plus 10% extra</b>. Packs cover <b>2.2 " + M2 + "</b>. How many packs?",
              options: ["6", "7", "5"],
              slips: { 1: "12 x 1.1 = 13.2, and 13.2 &#247; 2.2 is exactly 6. No rounding needed.", 2: "5 packs is 11 " + M2 + ", which does not even cover the room." },
              hint: "Add the 10% first, then divide. Check whether it comes out whole.",
              why: "13.2 &#247; 2.2 = 6 exactly, so <b>6 packs</b>." } } },

    /* ---------- chunk 3 ---------- */
    { type: "learn", topic: "What will it cost?", title: "Packs x price, then add it all up",
      fig: RECEIPT,
      ez: { title: "How many x price", html: "<p>Cost is <b>how many x the price</b>.</p><p>4 panels at " + PD + "20 is " + PD + "80. Add paint at " + PD + "9: <b>" + PD + "89</b>.</p>" },
      html: "<p>Once you know how many packs, the cost is <b>number of packs x price of one pack</b>. Then add anything else you need.</p>" +
        "<p class=\"a2task\"><b>Worked example</b><br>5 packs at " + PD + "18.50: 5 x 18.50 = " + PD + "92.50<br>1 tub of glue: " + PD + "7<br>Total: 92.50 + 7 = <b>" + PD + "99.50</b></p>" +
        "<p>Quick check: 5 packs at about " + PD + "20 is about " + PD + "100. Close, so it makes sense.</p>",
      lv: { mild: { html: "<p>Once you know how many you need, the cost is <b>how many x the price of one</b>. Then add anything else.</p>" +
              "<p class=\"a2task\"><b>Worked example</b><br>4 panels at " + PD + "20 each: 4 x 20 = " + PD + "80<br>1 tin of paint: " + PD + "9<br>Total: 80 + 9 = <b>" + PD + "89</b></p>" },
            spicy: { html: "<p>Cost is <b>packs x price</b>, but the cheapest pack is not always the best deal. Work out the <b>whole job</b> each way.</p>" +
              "<p class=\"a2task\"><b>Worked example</b>: you need 13.2 " + M2 + "<br>Pack A: 2.5 " + M2 + " for " + PD + "18. 13.2 &#247; 2.5 = 5.28, buy 6. 6 x 18 = <b>" + PD + "108</b><br>Pack B: 1.8 " + M2 + " for " + PD + "12. 13.2 &#247; 1.8 = 7.33, buy 8. 8 x 12 = <b>" + PD + "96</b><br>B is cheaper for this job, even though you buy more packs.</p>" } } },

    { type: "num", topic: "What will it cost?",
      q: "You need <b>8 packs</b> at <b>" + PD + "14.50</b> each. What do they cost?",
      boxes: [{ label: "Cost", a: 116, pre: PD }],
      slips: [[22.5, "That is 8 + 14.50. Multiply instead."], [112, "Close. Did you leave out the 50p? 8 x 50p is " + PD + "4."]],
      hint: "8 x 14 first, then 8 x 0.50, then add.",
      why: "8 x 14 = 112, 8 x 0.50 = 4, so <b>" + PD + "116</b>.",
      ez: { hint: "Try 6 x 10, then 6 x 5." },
      lv: { mild: { q: "You need <b>6 panels</b> at <b>" + PD + "15</b> each. What do they cost?",
              boxes: [{ label: "Cost", a: 90, pre: PD }],
              slips: [[21, "That is 6 + 15. Multiply instead."], [75, "That is 5 panels. Count again: 6 lots of 15."]],
              hint: "6 x 15: try 6 x 10 and 6 x 5, then add.",
              why: "6 x 10 = 60, 6 x 5 = 30, so <b>" + PD + "90</b>." },
            spicy: { q: "You need <b>22 " + M2 + "</b>. Pack A covers 2.4 " + M2 + " for " + PD + "21. Pack B covers 1.5 " + M2 + " for " + PD + "12. What does the whole job cost each way?",
              boxes: [{ label: "Using pack A", a: 210, pre: PD }, { label: "Using pack B", a: 180, pre: PD }],
              slips: [[0, 189, "That is 9 packs of A, which only covers 21.6 " + M2 + ". Round up to 10."], [1, 168, "That is 14 packs of B, which only covers 21 " + M2 + ". Round up to 15."]],
              hint: "For each pack: divide 22 by what it covers, round up, then multiply by the price.",
              why: "A: 22 &#247; 2.4 = 9.17, buy 10, 10 x 21 = <b>" + PD + "210</b>. B: 22 &#247; 1.5 = 14.67, buy 15, 15 x 12 = <b>" + PD + "180</b>." } } },

    { type: "num", topic: "What will it cost?",
      q: "The list for [[room]]: <b>9 packs</b> of [[floor]] at <b>" + PD + "16</b> each, and <b>2 tubs</b> of glue at <b>" + PD + "6.50</b> each. What is the total?",
      boxes: [{ label: "Total", a: 157, pre: PD }],
      slips: [[150.5, "That has only one tub of glue. There are two."], [144, "That is just the flooring. Add the glue too."], [13, "That is just the glue. Add the flooring too."]],
      hint: "Flooring: 9 x 16. Glue: 2 x 6.50. Then add.",
      why: "9 x 16 = 144. 2 x 6.50 = 13. 144 + 13 = <b>" + PD + "157</b>.",
      ez: { q: "<b>3 packs</b> at <b>" + PD + "10</b>. <b>1 tin</b> of paint at <b>" + PD + "8</b>. What is the total?" },
      lv: { mild: { q: "The list for [[room]]: <b>3 packs</b> of [[floor]] at <b>" + PD + "10</b> each, and <b>1 tin</b> of paint at <b>" + PD + "8</b>. What is the total?",
              boxes: [{ label: "Total", a: 38, pre: PD }],
              slips: [[30, "That is just the flooring. Add the paint too."], [18, "That is one pack and the paint. There are 3 packs."]],
              hint: "3 x 10, then add 8.", why: "3 x 10 = 30, and 30 + 8 = <b>" + PD + "38</b>." },
            spicy: { q: "Delivery is free on orders over " + PD + "200, otherwise it costs " + PD + "15. Using your answers for packs A (" + PD + "210) and B (" + PD + "180), what does B cost with delivery, and how much cheaper is it than A?",
              boxes: [{ label: "B with delivery", a: 195, pre: PD }, { label: "B saves", a: 15, pre: PD }],
              slips: [[0, 180, "B is under " + PD + "200, so it pays delivery. Add " + PD + "15."], [1, 30, "That ignores delivery. A has free delivery; B pays " + PD + "15."]],
              hint: "Which order is under " + PD + "200? Add delivery to that one only.",
              why: "B: 180 + 15 = <b>" + PD + "195</b>. A: " + PD + "210 with free delivery. B still saves <b>" + PD + "15</b>." } } },

    { type: "mc", topic: "What will it cost?", explain: true,
      q: "Someone works out 5 packs at " + PD + "18.50 and gets <b>" + PD + "925</b>. Is that sensible?",
      options: ["No: 5 packs at about " + PD + "20 is about " + PD + "100.", "Yes: the sum was done carefully.", "No: it should be " + PD + "9.25."],
      answer: 0,
      slips: { 1: "Careful sums can still have a slip, like a lost decimal point. Estimate to check.", 2: "That is far too small: one pack alone costs more than " + PD + "9.25." },
      hint: "Round 18.50 to 20 and estimate.",
      why: "About 5 x 20 = 100, so " + PD + "925 is ten times too big. The answer is " + PD + "92.50: the decimal point went missing.",
      ez: { q: "5 packs at " + PD + "18.50. Someone gets <b>" + PD + "925</b>. Is that sensible?", why: "5 x 20 is about 100. The answer is <b>" + PD + "92.50</b>.",
        slips: { 1: "Estimate to check. A decimal point can go missing.", 2: "Too small. 1 pack costs more than that." } },
      lv: { spicy: { q: "A pack of [[floor]] costs " + PD + "18 and covers 2.5 " + M2 + ". Someone says that is <b>" + PD + "1.39 per " + M2 + "</b>. Is that sensible?",
        options: ["No: about " + PD + "18 for under 3 " + M2 + " is over " + PD + "6 per " + M2 + ".", "Yes: it is a small number, which is good.", "No: it should be " + PD + "45 per " + M2 + "."],
        slips: { 1: "Small is not the same as right. Estimate it.", 2: "That is 18 x 2.5. Price per " + M2 + " is price divided by area." },
        hint: "Price per " + M2 + " = price &#247; area. Estimate 18 &#247; 3.",
        why: "18 &#247; 2.5 = " + PD + "7.20 per " + M2 + ". " + PD + "1.39 came from dividing the wrong way round (2.5 &#247; 18 is about 0.139)." } } },

    /* ---------- chunk 4 ---------- */
    { type: "learn", topic: "Stick to the budget", title: "Will it fit the budget?",
      fig: BUDGET,
      ez: { title: "Stick to the budget", html: "<p>A <b>budget</b> is the most you can spend.</p><p>" + PD + "100 take away " + PD + "85 leaves <b>" + PD + "15</b>.</p>" },
      html: "<p>A <b>budget</b> is the most you can spend. Add up everything, then take it away from the budget to see what is left.</p>" +
        "<p class=\"a2task\"><b>Worked example</b>: budget " + PD + "150<br>Flooring " + PD + "92.50 + paint " + PD + "24 + lights " + PD + "30 = " + PD + "146.50<br>Left over: 150 - 146.50 = <b>" + PD + "3.50</b></p>" +
        "<p>If it comes out over budget, swap something for a cheaper version, or leave something out. In the wise words of Jay's late, great grandfather: <i>stop</i>, before you spend money you do not have.</p>",
      lv: { mild: { html: "<p>A <b>budget</b> is the most you can spend. Add up everything, then take it away from the budget.</p>" +
              "<p class=\"a2task\"><b>Worked example</b>: budget " + PD + "100<br>Rug " + PD + "60 + lamp " + PD + "25 = " + PD + "85<br>Left over: 100 - 85 = <b>" + PD + "15</b></p>" +
              "<p>If it comes out over budget, swap something for a cheaper one. In the wise words of Jay's late, great grandfather: <i>stop</i>, before you spend money you do not have.</p>" } } },

    { type: "num", topic: "Stick to the budget",
      q: "Budget " + PD + "200 for [[room]]. Flooring " + PD + "157, paint " + PD + "18.50 and a light " + PD + "12. What is the total, and what is left?",
      boxes: [{ label: "Total", a: 187.5, pre: PD }, { label: "Left over", a: 12.5, pre: PD }],
      slips: [[0, 175.5, "That leaves out the light. Add all three."], [1, 13, "Check the pence: 200 - 187.50."]],
      hint: "Add the three costs. Then take the total away from 200.",
      why: "157 + 18.50 + 12 = <b>" + PD + "187.50</b>. 200 - 187.50 = <b>" + PD + "12.50</b> left.",
      ez: { q: "Budget " + PD + "50. Mat " + PD + "28. Shelf " + PD + "15. What is the total? What is left?", hint: "Add 28 and 15. Then take from 50.",
        slips: [[1, 22, "Take away both: 50 - 43."], [0, 13, "That is 28 - 15. Add them instead."]] },
      lv: { mild: { q: "Budget " + PD + "50 for [[room]]. A mat costs " + PD + "28 and a shelf costs " + PD + "15. What is the total, and what is left?",
              boxes: [{ label: "Total", a: 43, pre: PD }, { label: "Left over", a: 7, pre: PD }],
              slips: [[1, 22, "That is 50 - 28. Take away both things: 50 - 43."], [0, 13, "That is 28 - 15. Add them instead."]],
              hint: "Add 28 and 15. Then take that away from 50.",
              why: "28 + 15 = <b>" + PD + "43</b>. 50 - 43 = <b>" + PD + "7</b> left." },
            spicy: { q: "Budget " + PD + "300. Flooring " + PD + "195 (with delivery). Skirting: 14 m needed, sold in 2.4 m lengths at " + PD + "6.50. Paint: 2 tins at " + PD + "27. What is the total, and what is left?",
              boxes: [{ label: "Total", a: 288, pre: PD }, { label: "Left over", a: 12, pre: PD }],
              slips: [[0, 281.5, "That has 5 lengths of skirting, which only covers 12 m. Round up to 6."], [0, 261, "That has only one tin of paint."], [1, 18.5, "That uses 5 lengths of skirting. 14 &#247; 2.4 = 5.83, so 6 lengths."]],
              hint: "Skirting: 14 &#247; 2.4, round up, times 6.50. Then add everything.",
              why: "Skirting: 6 lengths x 6.50 = " + PD + "39. Paint: " + PD + "54. 195 + 39 + 54 = <b>" + PD + "288</b>. 300 - 288 = <b>" + PD + "12</b> left." } } },

    { type: "mc", topic: "Stick to the budget",
      q: "The plan comes to <b>" + PD + "146.50</b>: flooring " + PD + "92.50, paint " + PD + "24, lights " + PD + "30. But the budget is only <b>" + PD + "140</b>. Which change brings it under budget?",
      options: ["Swap the lights for a " + PD + "20 set.", "Swap the flooring for one costing " + PD + "88.", "Add a " + PD + "5 doormat."],
      answer: 0,
      slips: { 1: "That saves " + PD + "4.50, so the total is " + PD + "142. Still over.", 2: "Adding things makes it more, not less." },
      hint: "You need to save at least " + PD + "6.50. How much does each change save?",
      why: "New lights save " + PD + "10: " + PD + "136.50, under " + PD + "140.",
      ez: { q: "Rug " + PD + "30. Lamp " + PD + "25. Budget " + PD + "50. Which change gets it under budget?" },
      lv: { mild: { q: "A rug costs " + PD + "30 and a lamp costs " + PD + "25. That is " + PD + "55, but the budget is " + PD + "50. Which change brings it under budget?",
              options: ["Swap the lamp for a " + PD + "15 one.", "Swap the rug for a " + PD + "28 one.", "Add a " + PD + "5 cushion."],
              slips: { 1: "That saves " + PD + "2, so it is " + PD + "53. Still over.", 2: "Adding things makes it more." },
              hint: "You need to save at least " + PD + "5.",
              why: "The cheaper lamp saves " + PD + "10: 30 + 15 = " + PD + "45. Under budget." },
            spicy: { q: "Your total is " + PD + "288 (flooring " + PD + "195 with delivery, skirting " + PD + "39, paint " + PD + "54), but the budget is cut to " + PD + "280. Which change works, without leaving anything unfinished?",
              options: ["Collect the flooring yourself to skip the " + PD + "15 delivery.", "Switch to pack A at " + PD + "210 with free delivery.", "Buy skirting in 3 m lengths at " + PD + "8.50 instead.", "Buy one spare pack of B, just in case."],
              slips: { 1: "Pack A costs " + PD + "210, more than B's " + PD + "195 with delivery.", 2: "14 &#247; 3 = 4.67, so 5 lengths: 5 x 8.50 = " + PD + "42.50. That costs more than " + PD + "39.", 3: "A spare pack adds " + PD + "12." },
              hint: "You need to save at least " + PD + "8. Work out what each change does to the total.",
              why: "Collecting saves " + PD + "15: " + PD + "273, under " + PD + "280 with the room still finished." } } },

    { type: "widget", topic: "Stick to the budget", unscored: true,
      title: "Room planner",
      html: "<p>Change the room size and pick a pack. The planner works out the area, the packs and the cost against the budget. Have a play.</p>",
      ez: { html: "<p>Change the room. Pick a pack. See the cost.</p>" },
      mount: planner }
  ],

  realWorld: {
    title: "Who works this out for real?",
    html: "<p>Fitters, decorators, landscapers and set builders do this every day: measure, work out what to buy, round up, and give a price that fits the customer's budget. It is the same maths for kitting out your own room or first flat.</p>" +
      "<p>And for our big question, <b>if we could time travel, should we?</b> A time machine workshop would need kitting out too. Somebody has to pay for the floor.</p>",
    fig: '<svg viewBox="0 0 420 140" role="img" aria-label="Jay next to a time portal with a tape measure">' + A.portal(80, 70, 56) + A.jay(250, 50, 0.85, "wow") +
      A.bubble(296, 4, 120, 52, "Round it\nup!", 300) + '</svg>'
  },

  ez: {
    realWorld: { title: "Who does this for real?", html: "<p>Fitters and decorators do this every day.</p><p>Even a time machine workshop needs a floor!</p>" },
    make: { intro: "Plan a space. 2 things to buy and a budget. The card adds it up.", fields: [{}, {}, { label: "Cost of thing 1 in pounds" }, {}, { label: "Cost of thing 2 in pounds" }, { label: "Budget in pounds" }] }
  },

  make: {
    title: "Make a kit list",
    intro: "Plan a real or dream space: two things to buy, their costs and your budget. The card adds it up for you. Keep it, or send it to Jay.",
    fields: [
      { id: "project", label: "What are you kitting out?", ph: "My time machine workshop", max: 34 },
      { id: "i1", label: "Thing 1", ph: "6 packs of rubber floor tiles", max: 34 },
      { id: "c1", label: "Cost of thing 1 (pounds)", ph: "108", max: 8 },
      { id: "i2", label: "Thing 2", ph: "2 tins of silver paint", max: 34 },
      { id: "c2", label: "Cost of thing 2 (pounds)", ph: "54", max: 8 },
      { id: "budget", label: "Budget (pounds)", ph: "200", max: 8 }
    ],
    svg: function(v){
      function num(t){ var n = parseFloat(String(t || "").replace(/[^0-9.]/g, "")); return isNaN(n) ? null : n; }
      function cut(t, n){ t = String(t || ""); return t.length > n ? t.slice(0, n - 1) + "..." : t; }
      function m(n){ return n == null ? "?" : "&#163;" + money(n); }
      var c1 = num(v.c1), c2 = num(v.c2), b = num(v.budget);
      var tot = c1 != null && c2 != null ? c1 + c2 : null;
      var left = tot != null && b != null ? b - tot : null;
      var verdict = left == null ? "Add some numbers to see" : left >= 0 ? "Under budget: " + m(left) + " left" : "Over budget by " + m(-left);
      var vcol = left == null ? "#5b6180" : left >= 0 ? "#1f7a4d" : "#a85a00";
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
        '<rect width="600" height="420" rx="22" fill="#e8f2ec"/>' +
        '<rect x="70" y="40" width="460" height="360" rx="16" fill="#7a5532"/>' +
        '<rect x="88" y="62" width="424" height="322" rx="8" fill="#fffdf6"/>' +
        '<rect x="240" y="26" width="120" height="40" rx="8" fill="#b9bfcc" stroke="#141a33" stroke-width="3"/>' +
        '<text x="110" y="104" ' + F + ' font-size="14" font-weight="700" fill="#e04848" letter-spacing="2">KIT LIST</text>' +
        '<text x="110" y="136" ' + F + ' font-size="22" font-weight="700" fill="#141a33">' + esc(cut(v.project, 30)) + '</text>' +
        '<path d="M110 156h380" stroke="#141a33" stroke-width="2"/>' +
        '<text x="110" y="192" ' + F + ' font-size="17" fill="#141a33">' + esc(cut(v.i1, 30)) + '</text><text x="490" y="192" text-anchor="end" ' + F + ' font-size="17" fill="#141a33">' + m(c1) + '</text>' +
        '<text x="110" y="228" ' + F + ' font-size="17" fill="#141a33">' + esc(cut(v.i2, 30)) + '</text><text x="490" y="228" text-anchor="end" ' + F + ' font-size="17" fill="#141a33">' + m(c2) + '</text>' +
        '<path d="M110 246h380" stroke="#141a33" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<text x="110" y="278" ' + F + ' font-size="19" font-weight="700" fill="#141a33">Total</text><text x="490" y="278" text-anchor="end" ' + F + ' font-size="19" font-weight="700" fill="#141a33">' + m(tot) + '</text>' +
        '<text x="110" y="312" ' + F + ' font-size="16" fill="#141a33">Budget</text><text x="490" y="312" text-anchor="end" ' + F + ' font-size="16" fill="#141a33">' + m(b) + '</text>' +
        '<text x="110" y="356" ' + F + ' font-size="18" font-weight="700" fill="' + vcol + '">' + verdict + '</text>' +
        '</svg>';
    }
  }
};
})();
