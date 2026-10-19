#!/usr/bin/env python3
"""
Gives every main site page the home page's title: the echo title (a
ghost of itself behind it), an orange accent word, a round badge icon
beside it like the home page clock, and the chip and line underneath.

    python3 data/_build/heroes.py          (from the repo root; safe to rerun)

New pages: copy the header from any section hub, or run this again.
HQ pages keep their own looks and are left alone. ASCII only.
"""
import os, re, html, subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SKIP = ("egw/", "lp/", "lw/", "lc/", "hk/", "jt-hq/", "autumn-1/", "week-", "buddy/", "jt/", "board/", "games/", "day/", "index.html", "404.html")

RING = '<circle cx="50" cy="50" r="44" fill="#fffdf8" stroke="#0a2f38" stroke-width="6"/>'
GLYPH = {
    "practice": '<path d="M30 72l5-15 27-27 10 10-27 27z" fill="#ef7724" stroke="#0a2f38" stroke-width="4" stroke-linejoin="round"/><path d="M57 35l10 10M30 72l12-5" stroke="#0a2f38" stroke-width="4" stroke-linecap="round"/>',
    "baselines": '<circle cx="50" cy="50" r="24" fill="none" stroke="#0a2f38" stroke-width="4"/><path d="M50 26l7 24-7 24-7-24z" fill="#ef7724" stroke="#0a2f38" stroke-width="3" stroke-linejoin="round"/><circle cx="50" cy="50" r="4" fill="#0a2f38"/>',
    "tools": '<path d="M62 28a13 13 0 0 0-14 17L30 63a6 6 0 0 0 8 8l18-18a13 13 0 0 0 17-14l-8 8-8-2-2-8z" fill="#ef7724" stroke="#0a2f38" stroke-width="4" stroke-linejoin="round"/>',
    "ideas": '<path d="M50 24a18 18 0 0 0-10 33v8h20v-8a18 18 0 0 0-10-33z" fill="#ffc247" stroke="#0a2f38" stroke-width="4" stroke-linejoin="round"/><path d="M42 72h16M45 78h10" stroke="#0a2f38" stroke-width="4" stroke-linecap="round"/><path d="M50 40v12" stroke="#ef7724" stroke-width="4" stroke-linecap="round"/>',
    "wall": '<path d="M24 30q0-6 6-6h40q6 0 6 6v26q0 6-6 6H46l-12 10v-10h-4q-6 0-6-6z" fill="#fffdf8" stroke="#0a2f38" stroke-width="4" stroke-linejoin="round"/><text x="50" y="54" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="26" font-weight="900" fill="#ef7724">?</text>',
    "targets": '<circle cx="50" cy="50" r="26" fill="none" stroke="#0a2f38" stroke-width="4"/><circle cx="50" cy="50" r="15" fill="none" stroke="#0a2f38" stroke-width="4"/><circle cx="50" cy="50" r="6" fill="#ef7724"/><path d="M50 50l20-20M64 26l6 4 4 6" stroke="#0a2f38" stroke-width="4" stroke-linecap="round" fill="none"/>',
    "trips": '<path d="M50 76s-20-20-20-34a20 20 0 0 1 40 0c0 14-20 34-20 34z" fill="#ef7724" stroke="#0a2f38" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="42" r="7" fill="#fffdf8" stroke="#0a2f38" stroke-width="3"/>',
    "guest": '<rect x="34" y="24" width="32" height="52" rx="3" fill="#ffc247" stroke="#0a2f38" stroke-width="4"/><path d="M34 24l18 6v52l-18-6z" fill="#ef7724" stroke="#0a2f38" stroke-width="4" stroke-linejoin="round"/><circle cx="47" cy="54" r="2.5" fill="#0a2f38"/>',
    "teacher": '<circle cx="38" cy="50" r="12" fill="#ffc247" stroke="#0a2f38" stroke-width="4"/><path d="M50 50h24M66 50v8M72 50v6" stroke="#0a2f38" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="50" r="4" fill="#0a2f38"/>',
    "shuffle": '<rect x="28" y="28" width="44" height="44" rx="8" fill="#ef7724" stroke="#0a2f38" stroke-width="4" transform="rotate(-10 50 50)"/><g fill="#fffdf8"><circle cx="40" cy="40" r="4"/><circle cx="50" cy="50" r="4"/><circle cx="60" cy="60" r="4"/></g>',
}


def badge(kind):
    return ('<span class="badge" aria-hidden="true"><svg viewBox="0 0 100 100">' + RING + GLYPH[kind] + '</svg></span>')


def section(path):
    for k, pre in [("baselines", "baselines/"), ("tools", "tools/"), ("ideas", "projects/"), ("ideas", "ideas/"), ("wall", "wall/"),
                   ("trips", "trips/"), ("guest", "guest/"), ("teacher", "teacher/"), ("shuffle", "shuffle/"), ("practice", "practice/")]:
        if path.startswith(pre):
            return k
    if path == "my-targets.html":
        return "targets"
    return "practice"


CHIP = {"practice": "Practice", "projects/index.html": "Autumn 2", "projects": "Project", "ideas/index.html": "Idea board",
        "wall/index.html": "Question wall", "tools": "Tool"}


def chip_for(path):
    if path in CHIP:
        return CHIP[path]
    if path == "practice/index.html":
        return "Activity library"
    if path == "practice/shelves.html":
        return "Every subject"
    if path.startswith("projects/"):
        return "Your project"
    if path.startswith("tools/"):
        return "Tool"
    return "Practice"


def text_of(h):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", h))).strip()


def with_accent(inner):
    """Two tone like BASE5: the last word in orange, if there is more than one word and no accent yet."""
    if "accent" in inner or "<" in inner:
        return inner
    words = inner.strip().split(" ")
    if len(words) < 2:
        return inner
    return " ".join(words[:-1]) + ' <span class="accent">' + words[-1] + "</span>"


def fix_hero(s, path):
    m = re.search(r'<header class="hero[^"]*"[^>]*>.*?</header>', s, re.S)
    if not m:
        return s, False
    head = m.group(0)
    h1 = re.search(r"<h1([^>]*)>(.*?)</h1>", head, re.S)
    if not h1 or not text_of(h1.group(2)):
        return s, False
    attrs, inner = h1.group(1), h1.group(2)
    words = text_of(inner)
    inner2 = with_accent(inner)
    if 'class="' in attrs:
        attrs2 = attrs if "echo" in attrs else attrs.replace('class="', 'class="echo ', 1)
    else:
        attrs2 = attrs + ' class="echo"'
    if "data-echo" not in attrs2:
        attrs2 += ' data-echo="' + html.escape(words, quote=True) + '"'
    new_h1 = "<h1" + attrs2 + ">" + inner2 + "</h1>"
    head2 = head.replace(h1.group(0), new_h1, 1)
    if "toprow" not in head2 and "<svg" not in head2:
        head2 = head2.replace(new_h1, '<div class="toprow">\n      ' + new_h1 + "\n      " + badge(section(path)) + "\n    </div>", 1)
    return s.replace(head, head2, 1), head2 != head


def fix_weektheme(s, path):
    top = s.find('class="top"')
    m = re.compile(r'<div class="weektheme">\s*<h2>(.*?)</h2>\s*<span>(.*?)</span>\s*</div>', re.S).search(s, top)
    if not m or m.start() - top > 5000:
        return s, False
    title, line = m.group(1).strip(), m.group(2).strip()
    words = text_of(title)
    hero = ('<header class="hero hero-sm hero-page">\n'
            '    <div class="toprow">\n'
            '      <h1 class="echo" data-echo="' + html.escape(words, quote=True) + '">' + with_accent(title) + '</h1>\n'
            '      ' + badge(section(path)) + '\n'
            '    </div>\n'
            '    <div class="line"><span class="chip">' + chip_for(path) + '</span><p>' + line + '</p></div>\n'
            '  </header>')
    return s[:m.start()] + hero + s[m.end():], True


def main():
    files = subprocess.run(["git", "ls-files", "*.html"], cwd=ROOT, capture_output=True, text=True).stdout.split()
    done = []
    for f in files:
        if f.startswith(SKIP) or "/_" in f or f in ("index.html",):
            continue
        p = os.path.join(ROOT, f)
        s = open(p, encoding="utf-8").read()
        if 'class="top"' not in s:
            continue
        s2, a = fix_hero(s, f)
        b = False
        if not a and '<header class="hero' not in s:
            s2, b = fix_weektheme(s, f)
        if s2 != s:
            assert all(ord(c) < 128 for c in s2), f
            open(p, "w", encoding="utf-8").write(s2)
            done.append(f)
    print("pages given the home page title:", len(done))
    for f in done:
        print("  " + f)


if __name__ == "__main__":
    main()
