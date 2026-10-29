#!/usr/bin/env python3
"""
Adds tab icon (favicon) links to every page on the Base 5 site that does
not have one yet. Pages that already have their own icon (Buddy, Lunch and
any game that draws its own) are left exactly as they are.

The two lines go straight after the page's <title> line:
    <link rel="icon" href="/favicon.ico" sizes="32x32">
    <link rel="icon" href="/icons/<name>.svg" type="image/svg+xml">

Which icon a page gets is decided by its address, first match wins.
Keep ICON_MAP in step with B5ICON_MAP in /data/b5site.js.

Safe to run again at any time, from the repo root:
    python3 icons/_build/add_icon_links.py
Plain ASCII only.
"""
import os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

ICON_MAP = [
    # games in the vault, each with its own icon
    ("/projects/its-time.html", "/icons/its-time.svg"),
    ("/games/timeline-tantrum/", "/icons/timeline-tantrum.svg"),
    ("/practice/build-a-life.html", "/icons/build-a-life.svg"),
    ("/practice/hooked.html", "/icons/hooked.svg"),
    ("/practice/endorphin-house.html", "/icons/endorphin-house.svg"),
    ("/practice/jump-lab.html", "/icons/jump-lab.svg"),
    ("/practice/deep-diya.html", "/icons/deep-diya.svg"),
    ("/practice/sankofa.html", "/icons/sankofa.svg"),
    ("/sankofa.html", "/icons/sankofa.svg"),
    ("/practice/last-stand.html", "/icons/last-stand.svg"),
    ("/practice/tiny-legends.html", "/icons/tiny-legends.svg"),
    ("/practice/cue-the-sequence.html", "/icons/cue-the-sequence.svg"),
    ("/practice/paragraphs.html", "/icons/paragraph-dash.svg"),
    ("/practice/chip-run.html", "/icons/chip-run.svg"),
    ("/practice/chess.html", "/icons/chess.svg"),
    ("/jt/", "/icons/dugout.svg"),
    ("/lw/boxman/", "/icons/boxman.svg"),
    # student HQs: each wears its own (the HQ builds copy these across)
    ("/egw/", "/egw/favicon.svg"),
    ("/lp/", "/lp/favicon.svg"),
    ("/lw/", "/lw/favicon.svg"),
    ("/lc/", "/lc/favicon.svg"),
    ("/hk/", "/hk/favicon.svg"),
    ("/jt-hq/", "/jt-hq/favicon.svg"),
    # sections
    ("/games/", "/icons/vault.svg"),
    ("/practice/", "/icons/practice.svg"),
    ("/projects/", "/icons/projects.svg"),
    ("/teacher/", "/icons/staff.svg"),
    ("/cc/", "/icons/cc.svg"),
    ("/parents/", "/icons/parents.svg"),
    ("/guest/", "/icons/parents.svg"),
    ("/baselines/", "/icons/baselines.svg"),
    ("/trips/", "/icons/trips.svg"),
    ("/tools/", "/icons/tools.svg"),
    ("/wall/", "/icons/wall.svg"),
    ("/ideas/", "/icons/ideas.svg"),
    ("/my-targets.html", "/icons/targets.svg"),
    # everything else: the Base 5 bridge
    ("/", "/icons/base5.svg"),
]

HAS_ICON = re.compile(r'<link[^>]+rel="[^"]*\bicon\b', re.I)


def icon_for(url):
    for prefix, icon in ICON_MAP:
        if url.startswith(prefix):
            return icon
    return "/icons/base5.svg"


def links(icon):
    return ('<link rel="icon" href="/favicon.ico" sizes="32x32">\n'
            '<link rel="icon" href="%s" type="image/svg+xml">' % icon)


def main():
    added = kept = skipped = 0
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d != ".git"]
        for fn in filenames:
            if not fn.endswith(".html"):
                continue
            path = os.path.join(dirpath, fn)
            url = "/" + os.path.relpath(path, ROOT).replace(os.sep, "/")
            # a build template stands for pages in the folder above it
            url = re.sub(r"/_build/[^/]*$", "/page.html", url)
            s = open(path, encoding="utf-8").read()
            if HAS_ICON.search(s):
                kept += 1
                continue
            m = re.search(r"</title>[ \t]*\n?", s, re.I)
            head_end = s.lower().find("</head>")
            if not m or (head_end != -1 and m.start() > head_end):
                skipped += 1
                print("no <title> in the head, left alone:", url)
                continue
            line = m.group(0) if m.group(0).endswith("\n") else m.group(0) + "\n"
            s = s[:m.start()] + line + links(icon_for(url)) + "\n" + s[m.end():]
            open(path, "w", encoding="utf-8", newline="").write(s)
            added += 1
    print("icons added to %d pages, %d already had one, %d left alone" % (added, kept, skipped))


if __name__ == "__main__":
    main()
