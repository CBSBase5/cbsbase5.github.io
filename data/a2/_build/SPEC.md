# Autumn 2 milestone activities: how to write one

Each activity is one file, `/data/a2/<slug>.js`, that registers a pack:

```js
/* Base 5 Autumn 2 activity: <Title>. <Subject>. ASCII only. */
(function(){
var A = window.A2ART;   /* shared cameo drawings, see /data/a2/art.js */
(window.A2PACKS = window.A2PACKS || {})["<slug>"] = {
  a2: true, id: "a2-<slug>", title: "...", subject: "English" | "Maths" | "Physical World" | ...,
  bodyClass: "subj-eng" | "subj-maths" | "subj-home subj-pillar",
  mins: 20,                       /* honest total, 15 to 30 */
  line: "One line under the page title.",
  blurb: "Start card: what this is, how many chunks, what you make at the end.",
  note: "Folder note in Jay's voice: invitational, e.g. '..., if you fancy it.'",
  sure: true,
  levels: [ {id:"mild", name:"...", line:"..."}, {id:"medium", ...}, {id:"spicy", ...} ],
  themes: { time: {name:"Time travel", w:{...}}, football: {...}, horror: {...}, fishing: {...}, music: {...} },
  themeFor: { JT: "football", LC: "horror", HK: "fishing", LW: "music" },
  startFig: "<svg ...>",          /* optional picture on the start card */
  steps: [ ... ],
  realWorld: { title, html, fig },
  make: { title, intro, fields: [{id, label, ph, max}], svg: function(v, who){ return "<svg ...>"; } }
};
})();
```

`/data/a2/fact-check.js` is the reference: copy its shape.

## Steps (engine: /egw/engine.js)

All steps need `topic`. A run of steps with the same topic is one chunk.
Topics must not come back once another topic has started.

- `learn {title, html, fig}` or `learn {title, routes:[{name, html, fig}]}` (two routes in, e.g. "Read it" / "See it", for bigger activities)
- `mc {q, fig, options:[], answer:i, slips:{i:"..."}, hint, why}` (options shuffle; `fixed:true` keeps order)
- `multi {q, options:[], answers:[i,j], hint, why}`
- `num {q, fig, boxes:[{label, a:<number>, tol, pre, post, alts:[]}], slips:[[value, "..."]] or [[box, value, "..."]], hint, why}`
- `text {q, need:[[any of these],[and any of these]], model, slips:[[["words"], "..."]], hint, why}` (model must pass need)
- `sort {q, buckets:[], cards:[[text, bucketIndex]], hint, why}`
- `order {q, items:[in the right order], hint, why}`
- `match {q, pairs:[[left, right]], hint, why}`
- `write {q, fig, starters:[], checklist:[], minWords}` unmarked, sent to Jay if the student chooses
- `widget {title, html, mount:function(el, api){...}, unscored:true}` custom: api.data, api.save(), api.done("done"), api.level, api.theme, api.tok

Extras on any step: `stretch:true`, `explain:true` (offers "How did you get that?", on one or two steps per activity),
`lv:{mild:{...}, spicy:{...}}` overrides any field except type and topic.

Theme words: write `[[word]]` in any string; `[[Word]]` gives a capital letter for the start of a sentence.
Every theme must define every word used.

## The October 2026 design rules (Jay chose these; all activities follow them)

- Chunks of about five minutes: 3 to 5 chunks, each 3 to 5 questions, each ending at a natural stop.
- Three student-chosen levels, ids mild/medium/spicy, with fun names that fit the activity, never easy/hard.
  Mild is around Entry 2 to 3, Medium around Level 1, Spicy around Level 2 / GCSE foundation.
- Wrong answers name the likely slip (`slips`) for the common mistakes; no red crosses (the engine handles colour).
- Worked example then fade for anything with steps: full example, then steps left blank, then independent.
- Every new idea shown with a picture or diagram drawn in code (inline SVG, literal colours).
- A context switcher where it fits (themes), so the same skill can be football, horror, fishing, music or time travel.
- Retrieval warm up only where it fits, not every time.
- Light touch cameos from Jay (messy brown hair, big eyebrows, likes birds) and Bonnie (Jay's brown toy poodle, no tail),
  plus the odd class in joke ("Outrageous", "Unhand me, goblin", "My ears are not a toilet", "When I was in China...",
  "In the wise words of my late, great grandfather, stop."). Never the focus.
- One or two hidden surprises (`A2ART.egg(drawing, message)`), never required and never scored.
- Optional "how did you get that?" once or twice (`explain:true`).
- Ends with a real world "where you would use this" moment, linked to the half term question
  "If we could time travel, should we?" where it makes sense.
- Ends with something the student makes (`make`), drawn as an SVG card with literal colours (no CSS variables).
- Read it to me is LC only (the engine handles it).

## House style

- ASCII only. British English. No em dashes; avoid hyphens in prose ("five minute chunks").
- PDA-informed and invitational: "if you like", "have a go", "whenever you fancy it". No demands, no "wrong".
- Base 5 pages call the teacher Jay. Never "Mr Raine". No student names or initials in activities (they are shared).
- Never write a student's milestone wording into a page: the activity teaches the skill, it does not quote the target.

## Checking

    node data/a2/_build/validate.js <slug>
    python3 data/a2/_build/build_a2.py <slug>
    WALK_PORT=81xx python3 data/a2/_build/walk.py <slug>
