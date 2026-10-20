#!/usr/bin/env python3
"""
Builds the Autumn 2 milestone activities into the student HQs.

The content of each activity lives once, in /data/a2/<slug>.js. This
script:
  1. reads the plan (plan.py) and every activity's details (via node)
  2. makes a page for each student it is assigned to, inside their own
     HQ, at /<hq>/a2-<slug>.html, so it wears that HQ's look and its
     progress follows the student between devices
  3. works out the daily trickle of release dates
  4. writes /data/a2/drops.js: who gets what, on which day. Folders
     read this when the Folders tab has no Autumn 2 rows, and
     /teacher/a2-drops.html shows it and can add it to the sheet.

Run from the repo root:
    python3 data/a2/_build/build_a2.py
Jekyll does not publish folders starting with _ so this stays private.
ASCII only.
"""
import datetime, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)
import plan

ENGINE_V = "17"
A2CSS_V = "1"
ART_V = "1"

HQS = {
    "EGW": {"base": "egw", "sample": "egw/maths-money.html", "after": '<script src="/egw/biscuits.js?v=1"></script>'},
    "LP":  {"base": "lp",  "sample": "lp/english-creative.html", "after": ""},
    "LW":  {"base": "lw",  "sample": "lw/data.html", "after": ""},
    "LC":  {"base": "lc",  "sample": "lc/measures.html", "after": '<script src="/lc/jumpscare.js?v=4"></script>'},
    "HK":  {"base": "hk",  "sample": "hk/add-subtract.html", "after": ""},
    "JT":  {"base": "jt-hq", "sample": "jt-hq/add-subtract.html", "after": ""},
}


# shelf, group, main site subject colour class, by target
GROUPS = {
    "eng-infer": ("english", "Reading", "s-english"),
    "eng-factop": ("english", "Reading", "s-english"),
    "eng-cohesion": ("english", "Reading", "s-english"),
    "eng-organise": ("english", "Writing", "s-english"),
    "eng-punct": ("english", "Punctuation", "s-english"),
    "maths-number": ("maths", "Number", "s-maths"),
    "maths-shape": ("maths", "Shape and measure", "s-maths"),
    "ac-arch": ("about", "Making and building", "s-ac"),
    "hs-myths": ("about", "Myths and legends", "s-hs"),
    "pw-adventure": ("about", "Out and active", "s-pw"),
    "pw-balance": ("about", "Out and active", "s-pw"),
    "pfa-careers": ("about", "Careers", "s-pfa"),
    "pfa-transport": ("about", "Getting about", "s-pfa"),
    "se-earth": ("about", "Science", "s-science"),
}


def die(msg):
    sys.exit("build_a2: " + msg)


def ascii_only(path, text):
    bad = [(i + 1, l) for i, l in enumerate(text.split("\n")) if any(ord(c) > 127 for c in l)]
    if bad:
        die("non-ASCII in %s line %d: %r" % (path, bad[0][0], bad[0][1][:80]))


def pack_info(slugs):
    """Ask node for each pack's details (and check it loads)."""
    js = r"""
const fs = require("fs"), vm = require("vm");
const ctx = { console: console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[2] + "/data/a2/art.js", "utf8"), ctx);
const out = {};
for (const slug of JSON.parse(process.argv[3])) {
  const f = process.argv[2] + "/data/a2/" + slug + ".js";
  if (!fs.existsSync(f)) { out[slug] = { missing: true }; continue; }
  try { vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }); }
  catch (e) { out[slug] = { error: String(e && e.stack || e) }; continue; }
  const p = (ctx.window.A2PACKS || {})[slug];
  if (!p) { out[slug] = { error: "no A2PACKS entry" }; continue; }
  const topics = [];
  (p.steps || []).forEach(s => { if (!topics.length || topics[topics.length - 1] !== s.topic) topics.push(s.topic); });
  out[slug] = { id: p.id, title: p.title, subject: p.subject, bodyClass: p.bodyClass, mins: p.mins, line: p.line,
    note: p.note, chunks: topics, steps: (p.steps || []).length, a2: p.a2 };
}
console.log(JSON.stringify(out));
"""
    r = subprocess.run(["node", "-e", js, "x", ROOT, json.dumps(slugs)], capture_output=True, text=True)
    if r.returncode != 0:
        die("node failed: " + r.stderr[:2000])
    return json.loads(r.stdout)


def shell(who):
    """The head, header and footer of one of the HQ's own activity pages."""
    h = HQS[who]
    src = open(os.path.join(ROOT, h["sample"]), encoding="ascii").read()
    head = src[:src.index("<title>")]
    m = re.search(r"</title>\n(.*?)(<style>|<script src=\"/data/b5site)", src, re.S)
    links = m.group(1)
    links = re.sub(r'(<link rel="stylesheet" href="/(?!egw/egw\.css)[^"]+\.css[^"]*">)', r'\1\n<link rel="stylesheet" href="/data/a2/a2.css?v=' + A2CSS_V + '">', links, count=1)
    if "a2.css" not in links:
        links = links.replace('<script src="/egw/skin.js', '<link rel="stylesheet" href="/data/a2/a2.css?v=' + A2CSS_V + '">\n<script src="/egw/skin.js', 1)
    b5site = re.search(r'<script src="/data/b5site\.js[^"]*"></script>', src).group(0)
    header = re.search(r"<header class=\"hq\">.*?</header>", src, re.S).group(0)
    footer = re.search(r"<footer>.*?</footer>", src, re.S).group(0)
    hqname = re.search(r'<span class="hqname">([^<]+)<', header).group(1).strip()
    return head, links, b5site, header, footer, hqname


def page(who, slug, info):
    head, links, b5site, header, footer, hqname = shell(who)
    body = info.get("bodyClass") or ("subj-eng" if info["subject"] == "English" else "subj-maths" if info["subject"] == "Maths" else "subj-home subj-pillar")
    title = info["title"]
    line = info.get("line") or ""
    return (head +
        "<title>" + esc(title) + " - " + who + " " + esc(hqname) + "</title>\n" +
        links.rstrip() + "\n" + b5site + "\n</head>\n" +
        '<body class="' + body + '">\n<div class="grain"></div>\n\n' + header + "\n\n" +
        '<div class="wrap qwrap">\n  <div class="weektheme">\n    <h2>' + esc(title) + "</h2>\n    <span>" + esc(line) + "</span>\n  </div>\n" +
        '  <div id="egwApp"></div>\n</div>\n\n' + footer + "\n\n" +
        '<!-- Autumn 2 milestone activity. Content: /data/a2/' + slug + '.js. Built by data/a2/_build/build_a2.py, do not edit here. -->\n' +
        '<script src="/data/send.js"></script>\n' +
        '<script src="/data/a2/art.js?v=' + ART_V + '"></script>\n' +
        '<script src="/data/a2/' + slug + '.js?v=' + str(info["_v"]) + '"></script>\n' +
        '<script src="/egw/engine.js?v=' + ENGINE_V + '"></script>\n' +
        '<script>EGW.run(window.A2PACKS["' + slug + '"]);</script>\n' +
        (HQS[who]["after"] + "\n" if HQS[who]["after"] else "") +
        "</body>\n</html>\n")


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def school_days():
    d = datetime.date.fromisoformat(plan.FIRST_DROP)
    end = datetime.date.fromisoformat(plan.LAST_DROP)
    out = []
    while d <= end:
        if d.weekday() < 5 and d.weekday() != 1:   # no Tuesdays: trip day
            out.append(d.isoformat())
        d += datetime.timedelta(days=1)
    return out


def evenly(pool, n):
    """n items picked evenly from pool, in order."""
    if n <= 0:
        return []
    if n >= len(pool):
        return list(pool)
    return [pool[int((j + 0.5) * len(pool) / n)] for j in range(n)]


def spread(days, pillar_days, seq):
    """Put the core activities on days, in order: something new every
    school day where possible, never more than two on a day."""
    free = [d for d in days if d not in pillar_days]
    busy = [d for d in days if d in pillar_days]
    count = {d: 0 for d in days}
    c = len(seq)
    for d in evenly(free, c):
        count[d] += 1
    left = c - min(c, len(free))
    for d in evenly(busy, left):
        count[d] += 1
    left -= min(left, len(busy))
    for d in evenly(free, left):
        count[d] += 1
    out, i = [], 0
    for d in days:
        for _ in range(count[d]):
            if i < len(seq):
                out.append((d, seq[i]))
                i += 1
    while i < len(seq):
        out.append((days[-1], seq[i]))
        i += 1
    return out


def schedule():
    """who -> [(date, slug)], a daily trickle in step order."""
    days = school_days()
    order = {a[0]: k for k, a in enumerate(plan.ACTS)}
    who_acts = {}
    for slug, title, subject, covers in plan.ACTS:
        for w, target, step in covers:
            who_acts.setdefault(w, {}).setdefault(slug, []).append((target, step))
    out = {}
    for w in plan.ALL:
        mine = who_acts.get(w, {})
        fixed = [(plan.PILLAR_DAYS[s], s) for s in mine if s in plan.PILLAR_DAYS]
        core = [s for s in mine if s not in plan.PILLAR_DAYS]
        # chains by target, each in step order; English and Maths interleaved
        def key(s): return (min(st for t, st in mine[s]), order[s])
        chains = {}
        for s in core:
            t = sorted(mine[s], key=lambda x: x[1])[0][0]
            chains.setdefault(t, []).append(s)
        for t in chains:
            chains[t].sort(key=key)
        eng = [t for t in ["eng-infer", "eng-factop", "eng-cohesion", "eng-organise", "eng-punct"] if t in chains]
        mat = [t for t in ["maths-number", "maths-shape"] if t in chains]

        def roundrobin(ts):
            seq, i = [], 0
            pools = [list(chains[t]) for t in ts]
            while any(pools):
                p = pools[i % len(pools)]
                if p:
                    seq.append(p.pop(0))
                i += 1
            return seq
        es, ms = roundrobin(eng), roundrobin(mat)
        seq, ne, nm = [], len(es), len(ms)
        while es or ms:
            # keep English and Maths in proportion
            if es and (not ms or len(es) / max(ne, 1) >= len(ms) / max(nm, 1)):
                seq.append(es.pop(0))
            else:
                seq.append(ms.pop(0))
        out[w] = sorted(spread(days, [d for d, s in fixed], seq) + fixed)
    return out, who_acts


def main():
    slugs = [a[0] for a in plan.ACTS]
    only = sys.argv[1:]
    info = pack_info(slugs)
    ready = [s for s in slugs if not info[s].get("missing")]
    # only activities Jay has been given (checked and listed in published.txt) count as
    # ready for folders and the library; a writer's work in progress builds pages but stays hidden
    pub = set(l.strip() for l in open(os.path.join(HERE, "published.txt")) if l.strip())
    shown = [s for s in ready if s in pub]
    broken = [x for x in ready if info[x].get("error")]
    for x in broken:
        if not only or x in only:
            die("%s did not load: %s" % (x, info[x]["error"][:600]))
        print("note: %s does not load yet, skipped" % x)
    ready = [x for x in ready if x not in broken]
    keep = []
    for s in ready:
        p = os.path.join(ROOT, "data", "a2", s + ".js")
        txt = open(p, encoding="utf-8").read()
        bad = any(ord(c) > 127 for c in txt) or info[s]["id"] != "a2-" + s
        if bad and only and s not in only:
            print("note: %s is not ready yet (non-ASCII or wrong id), skipped" % s)
            continue
        ascii_only(p, txt)
        if info[s]["id"] != "a2-" + s:
            die("%s: id should be a2-%s" % (s, s))
        info[s]["_v"] = str(abs(hash_text(txt)) % 100000)
        keep.append(s)
    ready = keep
    sched, who_acts = schedule()

    # pages
    made = 0
    for slug, title, subject, covers in plan.ACTS:
        if slug not in ready or (only and slug not in only):
            continue
        # every HQ gets every activity, so anyone can open it from the
        # library in their own HQ; folders only bring the assigned ones
        for w in plan.ALL:
            path = os.path.join(ROOT, HQS[w]["base"], "a2-" + slug + ".html")
            html = page(w, slug, info[slug])
            ascii_only(path, html)
            open(path, "w", encoding="ascii").write(html)
            made += 1

    # drops
    items = []
    acts = {a[0]: a for a in plan.ACTS}
    for w in plan.ALL:
        for date, slug in sched[w]:
            a = acts[slug]
            kind = a[2] if a[2] in ("English", "Maths") else "Other"
            lv = plan.START[kind].get(w, "medium")
            items.append({
                "who": w, "date": date, "slug": slug,
                "title": (info.get(slug) or {}).get("title") or a[1],
                "subject": a[2],
                "href": "/" + HQS[w]["base"] + "/a2-" + slug + ".html?lv=" + lv,
                "note": (info.get(slug) or {}).get("note") or "",
                "covers": [[t, st] for t, st in sorted(who_acts[w][slug], key=lambda x: (x[0], x[1]))],
                "ready": slug in shown,
            })
    items.sort(key=lambda x: (x["date"], x["who"], x["slug"]))
    js = ("/* ==========================================================\n"
          "   Base 5 - Autumn 2 milestone activities: the drops\n"
          "   Built by data/a2/_build/build_a2.py from plan.py. Do not edit.\n"
          "   One item per student per activity, with the day it lands in\n"
          "   their HQ folder. Folders use this when the Folders tab of the\n"
          "   shared memory sheet has no Autumn 2 rows yet; the staff page\n"
          "   /teacher/a2-drops.html shows it and can copy it into the sheet.\n"
          "   covers: [target key, step]; target names are in targets.\n"
          "   ASCII only.\n"
          "   ========================================================== */\n"
          "window.B5DROPS = " + json.dumps({"v": 1, "first": plan.FIRST_DROP, "last": plan.LAST_DROP,
                                             "targets": plan.TARGETS, "items": items}, indent=1) + ";\n")
    ascii_only("drops.js", js)
    open(os.path.join(ROOT, "data", "a2", "drops.js"), "w", encoding="ascii").write(js)

    # the library on /practice/: one entry per activity, from the day it first lands for anyone
    first = {}
    for it in items:
        if it["slug"] not in first or it["date"] < first[it["slug"]]:
            first[it["slug"]] = it["date"]
    lib = []
    for slug, title, subject, covers in plan.ACTS:
        t = covers[0][1]
        shelf, group, subj = GROUPS[t]
        inf = info.get(slug) or {}
        lib.append({"slug": slug, "title": inf.get("title") or title, "shelf": shelf, "group": group, "subj": subj,
                    "line": inf.get("line") or "", "mins": inf.get("mins") or 0, "chunks": len(inf.get("chunks") or []),
                    "first": first.get(slug, plan.LAST_DROP), "ready": slug in shown})
    js2 = ("/* Base 5 - Autumn 2 activity library (the Practice tab). Built by\n"
           "   data/a2/_build/build_a2.py. Do not edit. Each activity shows from\n"
           "   the day it first lands in anyone's folder. ASCII only. */\n"
           "window.B5LIB = " + json.dumps({"v": 1, "first": plan.FIRST_DROP, "items": lib}, indent=1) + ";\n")
    ascii_only("library.js", js2)
    open(os.path.join(ROOT, "data", "a2", "library.js"), "w", encoding="ascii").write(js2)

    missing = [s for s in slugs if s not in ready]
    per = {w: len(sched[w]) for w in plan.ALL}
    print("published: %d  pages: %d  activities ready: %d of %d  drops: %d  per student: %s" % (len(shown), made, len(ready), len(slugs), len(items), per))
    if missing:
        print("not written yet: " + ", ".join(missing))


def hash_text(t):
    h = 2166136261
    for c in t.encode("utf-8"):
        h = ((h ^ c) * 16777619) & 0xffffffff
    return h


if __name__ == "__main__":
    main()
