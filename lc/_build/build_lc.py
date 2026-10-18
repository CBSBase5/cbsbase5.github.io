#!/usr/bin/env python3
"""
Builds the hub pages of LC's Night Shift HQ (/lc/) from EGW's (/egw/).

LC is building up English (Foundation 1 to 2) and Maths (Foundation 2 to 3)
from Jay's baselines, with no exam. LC's activities, escape rooms, question
banks, catalogue and jumpscare are LC's own files in /lc/ and are NOT touched
by this script. It copies the hub pages (home, skills map, sky, daily drop,
swipe deck, Study with Bonnie, looks and Jay's view) and gives them LC's
name, links, storage keys and look.

Shared code stays in /egw/ (engine.js, progress.js, skin.js, egw.css) and
reads window.HQ from /lc/conf.js. LC's look is /lc/lc.css.

Run from the repo root after changing any EGW hub page:
    python3 lc/_build/build_lc.py
Jekyll does not publish folders starting with _ so this stays private.
"""
import os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EGW = os.path.join(ROOT, "egw")
LC = os.path.join(ROOT, "lc")

HUBS = ["index.html", "papers.html", "sky.html", "daily.html", "swipe.html", "bonnie.html", "looks.html", "teacher.html"]
SHARED = r"(engine\.js|skin\.js|progress\.js|egw\.css)"
LC_CSS = "/lc/lc.css?v=3"
CONF = "/lc/conf.js?v=1"
CAT_V = "1"
BANK_V = "1"


def must(s, a, b, count=None, where=""):
    n = s.count(a)
    if n == 0 or (count is not None and n != count):
        sys.exit("build_lc: expected %s of %r in %s, found %d" % (count or "some", a[:70], where, n))
    return s.replace(a, b)


def common(s, name):
    # EGW's floating biscuits stay in EGW's space
    s = re.sub(r'<script src="/egw/biscuits\.js[^"]*"></script>\n?', "", s)
    # EGW's break game (Dunk) and its shared engine stay out; this HQ adds its own below
    s = re.sub(r'<script src="/data/hqbreak\.js[^"]*"></script>\n?', "", s)
    s = re.sub(r'<script src="/egw/dunk\.js[^"]*"></script>\n?', "", s)
    s = must(s, '<link rel="stylesheet" href="/egw/egw.css', '<script src="%s"></script>\n<link rel="stylesheet" href="/egw/egw.css' % CONF, 1, name)
    s = re.sub(r'(<link rel="stylesheet" href="/egw/egw\.css\?v=\d+">)', r'\1\n<link rel="stylesheet" href="%s">' % LC_CSS, s, count=1)
    s = must(s, "&display=swap", "&family=Space+Mono:wght@400;700&display=swap", None, name)
    s = s.replace('<span class="hqlogo">EGW</span>', '<span class="hqlogo">LC</span>')
    s = s.replace("GCSE HQ<small>revision and planning</small>", "Night Shift HQ<small>English and Maths</small>")
    s = s.replace("EGW's GCSE HQ", "LC's Night Shift HQ").replace(" - EGW GCSE HQ", " - LC Night Shift HQ")
    s = s.replace('"base5.who.v1", "EGW"', '"base5.who.v1", "LC"')
    s = re.sub(r"/egw/(?!" + SHARED + ")", "/lc/", s)
    s = s.replace("b5.egw.", "b5.lc.")
    s = s.replace('filename: "egw-', 'filename: "lc-')
    s = re.sub(r'/lc/catalogue\.js\?v=\d+', "/lc/catalogue.js?v=" + CAT_V, s)
    s = re.sub(r'/lc/(daily|swipe)-bank-(maths|english)\.js\?v=\d+', r"/lc/\1-bank-\2.js?v=" + BANK_V, s)
    s = re.sub(r"\bEGW\b(?![.\w])", "LC", s)
    s = s.replace("b5.egwteacher.", "b5.lcteacher.").replace("EGWJAY1", "LCJAY1").replace("EGWSAVE1", "LCSAVE1")
    s = s.replace("GCSE HQ", "Night Shift HQ")
    return s


def hub_patches(name, s):
    if name == "index.html":
        s = re.sub(r"\n\s*ideas\.push\('<a href=\"/lc/mark-jay\.html\">.*?\);", "", s, count=1)
        if "mark-jay" in s:
            sys.exit("build_lc: mark-jay link still in index")
        s = must(s, 'english: "Reading closely, writing to describe, and writing to win an argument."',
                 'english: "Signs, emails and notes, capital letters, spelling and forms."', 1, name)
        s = must(s, 'maths: "Foundation papers, with stretch towards grade 5."',
                 'maths: "Numbers, adding and taking away, times tables, measuring, money and time."', 1, name)
        s = must(s, '<a href="/lc/papers.html">Papers</a>', '<a href="/lc/papers.html">Skills map</a>', 1, name)
        s = must(s, "<b>What's on the papers</b><small>How each exam looks, and where to practise every topic.</small>",
                 "<b>Your skills map</b><small>Every skill, where you are now, and where to practise each one.</small>", 1, name)
        a = s.index('<a href="/practice/gcse-foundation-paper-1.html">')
        b = s.index('<a href="/practice/#english-gcse">')
        b = s.index("</a>", b) + 4
        s = s[:a] + ('<a href="/practice/punctuation.html"><b>Punctuation</b><span>English drills</span></a>\n'
                     '      <a href="/practice/fractions.html"><b>Fractions</b><span>Maths drills</span></a>\n'
                     '      <a href="/practice/multiplication.html"><b>Multiplication</b><span>Maths drills</span></a>\n'
                     '      <a href="/practice/day-at-school.html"><b>Story builder</b><span>English, make something</span></a>') + s[b:]
        # the jumpscare button
        s = must(s, '<script src="/data/send.js"></script>', '<script src="/data/send.js"></script>\n<script src="/lc/jumpscare.js?v=4" data-button="1"></script>\n<script src="/data/hqbreak.js?v=3"></script>\n<script src="/lc/break.js?v=1"></script>', 1, name)
    if name == "papers.html":
        s = must(s, "<title>What's on the papers - ", "<title>Your skills map - ", 1, name)
        s = must(s, "<h1>What's on<br>the <em>papers</em></h1>", "<h1>Your<br><em>skills</em> map</h1>", 1, name)
        s = must(s, "<p>What each exam looks like, the topics that turn up, and a link straight to the chunk that practises each one. A filled number means you have already finished that chunk.</p>",
                 "<p>Where you are now, what comes next, and a link straight to the chunk that practises each skill. A filled number means you have already finished that chunk.</p>", 1, name)
        s = must(s, "'<span class=\"kicker\">The exam</span>'", "'<span class=\"kicker\">Your steps</span>'", 1, name)
        s = must(s, "<span>topics with an HQ activity</span>", "<span>skills with an HQ activity</span>", 1, name)
        s = must(s, '<span class="kicker">Topics that come up</span>', '<span class="kicker">Every skill</span>', 1, name)
        s = must(s, "<h3>Every topic, and where to practise it</h3>", "<h3>Every skill, and where to practise it</h3>", 1, name)
        s = must(s, '<span class="often">Often</span> turns up most years', '<span class="often">Key</span> a key skill to start with', 1, name)
        s = must(s, "' <span class=\"often\">Often</span>'", "' <span class=\"often\">Key</span>'", 1, name)
    if name not in ("index.html", "teacher.html"):
        s = must(s, "</body>", '<script src="/lc/jumpscare.js?v=4"></script>\n</body>', 1, name)
    if name == "daily.html":
        for sub in ("bio", "stats"):
            s = re.sub(r'<script src="/lc/daily-bank-%s\.js\?v=\d+"></script>\n' % sub, "", s)
        s = must(s, 'var CYCLE = ["maths", "english", "bio", "stats"];', 'var CYCLE = ["maths", "english"];', 1, name)
        s = re.sub(r'var START = "\d{4}-\d\d-\d\d";', 'var START = "2026-10-14";', s)
        s = must(s, "One question a day, from any of your four subjects.", "One question a day, English or Maths.", 1, name)
        s = s.replace('seeded("egw-daily-"', 'seeded("lc-daily-"')
    if name == "swipe.html":
        for sub in ("bio", "stats"):
            s = re.sub(r'<script src="/lc/swipe-bank-%s\.js\?v=\d+"></script>\n' % sub, "", s)
        s = must(s, '["mixed", "maths", "english", "bio", "stats"].forEach', '["mixed", "maths", "english"].forEach', 1, name)
        s = must(s, "(maths|english|bio|stats)", "(maths|english)", 1, name)
        s = must(s, 'maths: "#ffd23f", english: "#ff5d5d"', 'maths: "#ff5c5c", english: "#39d98a"', 1, name)
    if name == "sky.html":
        s = must(s, 'english: "#ff7a7a", maths: "#ffd23f"', 'english: "#39d98a", maths: "#ff5c5c"', 1, name)
    if name == "teacher.html":
        # Jay's view talks about LC as "he"
        for a, b in [
            ("Her progress is saved on her own device. When she taps", "LC's progress is saved on his own device. When he taps"),
            ("on her HQ page", "on his HQ page"),
            ("to see where she is.", "to see where he is."),
            ("Show her progress", "Show LC's progress"),
            ("sends her progress", "sends his progress"),
            ("Where she leaned on Show me most", "Where he leaned on Show me most"),
            ("Her ratings here were made", "His ratings here were made"),
            ("rated by her,", "rated by him,"),
            ("Her rating", "His rating"),
            ("the last time she saw them", "the last time he saw them"),
            ("Things she noted to remember", "Things he noted to remember"),
        ]:
            s = must(s, a, b, None, name)
        left = re.findall(r"[^/*\n]{0,30}\b(?:she|her|herself)\b", re.sub(r"/\*.*?\*/", "", s, flags=re.S), flags=re.I)
        if left:
            sys.exit("build_lc: pronouns left in teacher.html: %r" % left[:5])
    return s


def main():
    written = []
    for name in HUBS:
        s = open(os.path.join(EGW, name)).read()
        s = common(s, name)
        s = hub_patches(name, s)
        s = must(s, "<!DOCTYPE html>\n", "<!DOCTYPE html>\n<!-- BUILT by lc/_build/build_lc.py from the shared HQ page. Edit the source and rebuild. -->\n", 1, name)
        if re.search(r"[^\x00-\x7f]", s):
            sys.exit("build_lc: non ASCII in " + name)
        open(os.path.join(LC, name), "w").write(s)
        written.append(name)
    print("build_lc: wrote %d hub pages to /lc/: %s" % (len(written), ", ".join(written)))


if __name__ == "__main__":
    main()
