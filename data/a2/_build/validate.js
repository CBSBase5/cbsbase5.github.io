/* Checks every Autumn 2 activity pack without a browser.
   node data/a2/_build/validate.js [slug ...]
   Resolves every level x theme the way the engine does and checks
   each step's shape, answers, slips, chunk sizes and the extras the
   October design rules ask for. ASCII only. */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "../../..");
const ctx = { console: console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(ROOT + "/data/a2/art.js", "utf8"), ctx);

function norm(s){ return String(s).toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[^a-z0-9.'\/ ]/g, " ").replace(/\s+/g, " ").trim(); }
function strip(s){ return String(s).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim(); }
function parseNum(s){
  s = String(s).trim().replace(/[\u2212\u2013]/g, "-").replace(/[\u00a3$,%]/g, "").replace(/\s+/g, " ");
  s = s.replace(/^[a-z]\s*=\s*/i, "");
  s = s.replace(/(\s*[a-z\u00b0\u00b2\u00b3\u03c0]+(\s*\/\s*[a-z\u00b2\u00b3]+)?)+$/i, "").trim();
  if(/^-?\d{1,3}( \d{3})+(\.\d+)?$/.test(s)) s = s.replace(/ /g, "");
  const mixed = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if(mixed){ const w = parseFloat(mixed[1]), f = parseFloat(mixed[2]) / parseFloat(mixed[3]); return w < 0 ? w - f : w + f; }
  const frac = s.match(/^(-?\d*\.?\d+)\/(\d*\.?\d+)$/);
  if(frac) return parseFloat(frac[1]) / parseFloat(frac[2]);
  if(/^-?\d*\.?\d+$/.test(s)) return parseFloat(s);
  return NaN;
}
function textHit(s, val){
  const t = " " + norm(val) + " ";
  if(s.exact) return s.need.every(g => g.some(w => norm(val).replace(/[.\s]+$/, "") === norm(w).replace(/[.\s]+$/, "")));
  return s.need.every(g => g.some(w => t.indexOf(" " + norm(w)) >= 0));
}

function resolver(p, lv, th){
  function tok(v){
    if(typeof v === "string"){
      const t = p.themes && th && p.themes[th];
      return v.indexOf("[[") < 0 ? v : v.replace(/\[\[([a-zA-Z0-9_]+)\]\]/g, (m, k) => { if(t && t.w && t.w[k] != null) return t.w[k]; const lo = k.charAt(0).toLowerCase() + k.slice(1); if(t && t.w && t.w[lo] != null){ const x = String(t.w[lo]); return x.charAt(0).toUpperCase() + x.slice(1); } return "@@MISSING:" + k + "@@"; });
    }
    if(Array.isArray(v)) return v.map(tok);
    if(v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype){ const o = {}; Object.keys(v).forEach(k => o[k] = tok(v[k])); return o; }
    return v;
  }
  return function(s, vi){
    const o = {};
    Object.keys(s).forEach(k => { if(k !== "lv" && k !== "vary") o[k] = s[k]; });
    if(s.lv && s.lv[lv]) Object.keys(s.lv[lv]).forEach(k => { if(k !== "topic") o[k] = s.lv[lv][k]; });
    const vv = vi && Array.isArray(s.vary) ? s.vary[vi - 1] : null;
    if(vv){ Object.keys(vv).forEach(k => { if(k !== "topic" && k !== "type" && k !== "lv") o[k] = vv[k]; });
      if(vv.lv && vv.lv[lv]) Object.keys(vv.lv[lv]).forEach(k => { if(k !== "topic" && k !== "type") o[k] = vv.lv[lv][k]; }); }
    const out = {};
    Object.keys(o).forEach(k => out[k] = typeof o[k] === "function" ? o[k] : tok(o[k]));
    return out;
  };
}

const SCORED = ["mc", "multi", "num", "text", "sort", "order", "match", "mark", "unlock"];
const TYPES = SCORED.concat(["learn", "write", "widget"]);

function check(slug){
  const errs = [], warns = [];
  const file = ROOT + "/data/a2/" + slug + ".js";
  const src = fs.readFileSync(file, "utf8");
  src.split("\n").forEach((l, i) => { if(/[^\x00-\x7F]/.test(l)) errs.push("non-ASCII on line " + (i + 1)); });
  if(/\u2014|\u2013/.test(src)) errs.push("dash characters");
  try{ vm.runInContext(src, ctx, { filename: file }); }catch(e){ return { errs: ["does not load: " + e.message], warns }; }
  const p = (ctx.A2PACKS || {})[slug];
  if(!p) return { errs: ["no A2PACKS[\"" + slug + "\"]"], warns };
  if(!p.a2) errs.push("a2:true missing");
  if(p.id !== "a2-" + slug) errs.push("id should be a2-" + slug);
  ["title", "subject", "blurb", "line", "note"].forEach(k => { if(!p[k] || typeof p[k] !== "string") errs.push("missing " + k); });
  if(!p.mins) errs.push("missing mins");
  if(!Array.isArray(p.levels) || p.levels.length !== 3) errs.push("needs three levels");
  else{
    const ids = p.levels.map(l => l.id).join(",");
    if(ids !== "mild,medium,spicy") errs.push("level ids must be mild,medium,spicy (names can be anything): " + ids);
    p.levels.forEach(l => { if(!l.name || !l.line) errs.push("level " + l.id + " needs name and line"); if(/easy|hard/i.test(l.name)) errs.push("level name says easy/hard: " + l.name); });
  }
  if(!p.realWorld || !p.realWorld.title || !p.realWorld.html) errs.push("realWorld {title, html} missing");
  if(!p.make || typeof p.make.svg !== "function" || !Array.isArray(p.make.fields) || !p.make.fields.length) errs.push("make {title, fields, svg} missing");
  if(!/class=\\?"egg|\.egg\(/.test(src)) errs.push("no hidden surprise (A2ART.egg or class=\"egg\")");
  if(!/A2ART\.(jay|bonnie|bird)\(/.test(src) && !/Bonnie|Jay/.test(src)) warns.push("no Jay/Bonnie cameo found");
  if(/\byour teacher\b/i.test(src)) warns.push("says 'your teacher' (Base 5 pages say Jay)");
  if(/Mr Raine/i.test(src)) errs.push("never Mr Raine");
  (src.match(/(^|"|[.!?]\s+|<p>|<b>|<li>|\\")\[\[[a-z][a-zA-Z0-9_]*\]\]/g) || []).slice(0, 3).forEach(m => warns.push("sentence may start with a lower case theme word: " + m.trim() + " (use [[Word]] for a capital)"));
  if(!Array.isArray(p.steps) || p.steps.length < 8) errs.push("too few steps");
  if(errs.length) return { errs, warns };

  const themes = p.themes ? Object.keys(p.themes) : [null];
  const explains = p.steps.filter(s => s.explain).length;
  if(explains < 1 || explains > 3) warns.push("explain:true on " + explains + " steps (aim for 1 or 2)");
  let slipCount = 0;
  p.steps.forEach((s, i) => {
    if(TYPES.indexOf(s.type) < 0) errs.push("step " + i + ": unknown type " + s.type);
    if(!s.topic) errs.push("step " + i + ": no topic");
    if(s.lv){
      Object.keys(s.lv).forEach(k => {
        if(["mild", "medium", "spicy"].indexOf(k) < 0) errs.push("step " + i + ": lv key " + k);
        if(s.lv[k].type || s.lv[k].topic) errs.push("step " + i + ": lv cannot change type or topic");
      });
    }
    if(s.slips) slipCount++;
  });
  if(slipCount < 3) warns.push("only " + slipCount + " steps name a likely slip");
  /* topics contiguous, chunk sizes */
  const seen = {}, chunks = [];
  p.steps.forEach((s, i) => {
    const last = chunks[chunks.length - 1];
    if(!last || last.t !== s.topic){
      if(seen[s.topic]) errs.push("topic \"" + s.topic + "\" comes back after a different topic (step " + i + ")");
      seen[s.topic] = 1; chunks.push({ t: s.topic, q: 0, n: 0 });
    }
    const c = chunks[chunks.length - 1]; c.n++; if(s.type !== "learn") c.q++;
  });
  if(chunks.length < 3 || chunks.length > 6) warns.push(chunks.length + " chunks (aim for 3 to 5)");
  chunks.forEach(c => { if(c.q < 2 || c.q > 6) warns.push("chunk \"" + c.t + "\" has " + c.q + " questions (aim 3 to 5)"); });

  ["mild", "medium", "spicy"].forEach(lv => themes.forEach(th => {
    const R = resolver(p, lv, th), tag = "[" + lv + (th ? "/" + th : "") + "] ";
    p.steps.forEach((raw, i) => { [0].concat((raw.vary || []).map((x, n) => n + 1)).forEach(vi => {
      const s = R(raw, vi), at = tag + "step " + i + (vi ? " version " + (vi + 1) : "") + " (" + s.type + "): ";
      const blob = JSON.stringify(s, (k, v) => typeof v === "function" ? undefined : v);
      const miss = blob.match(/@@MISSING:([a-zA-Z0-9_]+)@@/);
      if(miss) errs.push(at + "theme word [[" + miss[1] + "]] missing");
      if(/var\(--/.test(blob)) warns.push(at + "uses a CSS variable in a picture");
      switch(s.type){
        case "learn":
          if(!(s.routes && s.routes.length) && !s.html) errs.push(at + "no html");
          if(!s.title) errs.push(at + "no title");
          break;
        case "mc":
          if(!Array.isArray(s.options) || s.options.length < 2) errs.push(at + "options");
          else if(!(s.answer >= 0 && s.answer < s.options.length)) errs.push(at + "answer out of range");
          else{
            const t = s.options.map(o => norm(strip(o)));
            if(new Set(t).size !== t.length) errs.push(at + "two options read the same");
            if(s.slips && !Array.isArray(s.slips)) Object.keys(s.slips).forEach(k => { if(k !== "any" && !(+k >= 0 && +k < s.options.length)) errs.push(at + "slip for option " + k + " (no such option)"); if(+k === s.answer) errs.push(at + "slip on the right answer"); });
          }
          if(!s.q) errs.push(at + "no q");
          break;
        case "multi":
          if(!Array.isArray(s.options) || !Array.isArray(s.answers) || !s.answers.length) errs.push(at + "options/answers");
          else if(s.answers.some(a => !(a >= 0 && a < s.options.length))) errs.push(at + "answers out of range");
          break;
        case "num":
          if(!Array.isArray(s.boxes) || !s.boxes.length) errs.push(at + "boxes");
          else s.boxes.forEach((b, k) => { if(typeof b.a !== "number" || isNaN(b.a)) errs.push(at + "box " + k + " a must be a number"); });
          if(Array.isArray(s.slips)) s.slips.forEach(r => {
            const val = r.length === 3 ? r[1] : r[0], box = r.length === 3 ? r[0] : 0;
            [].concat(val).forEach(v => { if(s.boxes[box] && Math.abs(v - s.boxes[box].a) < 1e-9) errs.push(at + "slip value equals the right answer"); });
          });
          break;
        case "text":
          if(!Array.isArray(s.need) || !s.need.every(Array.isArray)) errs.push(at + "need must be [[...],[...]]");
          else if(!s.model) errs.push(at + "text needs a model answer");
          else if(!textHit(s, strip(s.model))) errs.push(at + "the model answer would be marked wrong: " + strip(s.model));
          break;
        case "sort":
          if(!Array.isArray(s.buckets) || s.buckets.length < 2 || !Array.isArray(s.cards) || s.cards.length < 3) errs.push(at + "buckets/cards");
          else s.cards.forEach(c => { if(!(c[1] >= 0 && c[1] < s.buckets.length)) errs.push(at + "card bucket out of range: " + c[0]); });
          break;
        case "order":
          if(!Array.isArray(s.items) || s.items.length < 3) errs.push(at + "items");
          break;
        case "match":
          if(!Array.isArray(s.pairs) || s.pairs.length < 3) errs.push(at + "pairs");
          else{ const r = s.pairs.map(x => norm(strip(x[1]))); if(new Set(r).size !== r.length) errs.push(at + "two right-hand sides read the same"); }
          break;
        case "write":
          if(!s.q) errs.push(at + "no q");
          break;
        case "widget":
          if(typeof s.mount !== "function") errs.push(at + "widget needs mount()");
          break;
      }
    }); });
    try{
      const fields = (p.make.fields || []);
      const vals = {}; fields.forEach(f => vals[f.id] = f.ph || "x");
      const svg = p.make.svg(vals, { who: "LC", level: lv, theme: th });
      if(!/^<svg[\s\S]*<\/svg>$/.test(String(svg).trim())) errs.push(tag + "make.svg does not return an <svg>");
      if(/var\(--/.test(svg)) errs.push(tag + "make.svg uses CSS variables (they do not survive saving as a picture)");
      if(!/viewBox=/.test(svg)) errs.push(tag + "make.svg needs a viewBox");
    }catch(e){ errs.push(tag + "make.svg threw: " + e.message); }
  }));
  return { errs: Array.from(new Set(errs)), warns: Array.from(new Set(warns)) };
}

const all = fs.readdirSync(ROOT + "/data/a2").filter(f => /^[a-z0-9-]+\.js$/.test(f) && ["art.js", "drops.js", "library.js"].indexOf(f) < 0).map(f => f.replace(/\.js$/, ""));
const list = process.argv.slice(2).length ? process.argv.slice(2) : all;
let bad = 0;
list.forEach(slug => {
  const r = check(slug);
  if(r.errs.length) bad++;
  console.log((r.errs.length ? "FAIL " : "ok   ") + slug + (r.warns.length ? "  (" + r.warns.length + " notes)" : ""));
  r.errs.slice(0, 25).forEach(e => console.log("   x " + e));
  r.warns.slice(0, 12).forEach(e => console.log("   - " + e));
});
process.exit(bad ? 1 : 0);
