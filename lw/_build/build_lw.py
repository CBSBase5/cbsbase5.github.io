#!/usr/bin/env python3
"""
Builds the hub pages of LW's Skills HQ (/lw/) from EGW's (/egw/).

LW is working towards Functional Skills Level 1 (City & Guilds English,
Pearson Edexcel Maths). His activities, escape rooms, question banks and
catalogue are his own files in /lw/ and are NOT touched by this script.
What this script copies are the hub pages (home, papers, sky, daily drop,
swipe deck, Study with Bonnie, looks and Jay's view), giving them LW's
name, links, storage keys and look.

Shared code stays in /egw/: engine.js, progress.js, skin.js and egw.css.
They read window.HQ from /lw/conf.js. LW's own look is /lw/lw.css; /lw/showstopper.js is his pop up rhythm game.

Run from the repo root after changing any EGW hub page:
    python3 lw/_build/build_lw.py
Jekyll does not publish folders starting with _ so this stays private.
"""
import os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EGW = os.path.join(ROOT, "egw")
LW = os.path.join(ROOT, "lw")

HUBS = ["index.html", "papers.html", "sky.html", "daily.html", "swipe.html", "bonnie.html", "looks.html", "folder.html", "teacher.html"]
SHARED = r"(engine\.js|skin\.js|progress\.js|egw\.css)"
LW_CSS = "/lw/lw.css?v=1"
CONF = "/lw/conf.js?v=1"
CAT_V = "1"
BANK_V = "1"


def must(s, a, b, count=None, where=""):
    n = s.count(a)
    if n == 0 or (count is not None and n != count):
        sys.exit("build_lw: expected %s of %r in %s, found %d" % (count or "some", a[:70], where, n))
    return s.replace(a, b)


def common(s, name):
    # EGW's floating biscuits stay in EGW's space
    s = re.sub(r'<script src="/egw/biscuits\.js[^"]*"></script>\n?', "", s)
    # EGW's break game (Dunk) and its shared engine stay out; this HQ adds its own below
    s = re.sub(r'<script src="/data/hqbreak\.js[^"]*"></script>\n?', "", s)
    s = re.sub(r'<script src="/data/hqgame\.js[^"]*"></script>\n?', "", s)
    s = re.sub(r'<script src="/egw/dunk\.js[^"]*"></script>\n?', "", s)
    s = must(s, '<link rel="stylesheet" href="/egw/egw.css', '<script src="%s"></script>\n<link rel="stylesheet" href="/egw/egw.css' % CONF, 1, name)
    s = re.sub(r'(<link rel="stylesheet" href="/egw/egw\.css\?v=\d+">)', r'\1\n<link rel="stylesheet" href="%s">' % LW_CSS, s, count=1)
    s = must(s, "&display=swap", "&family=Bebas+Neue&family=Outfit:wght@400;500;600;700&display=swap", None, name)
    s = s.replace('<span class="hqlogo">EGW</span>', '<span class="hqlogo">LW</span>')
    s = s.replace("GCSE HQ<small>revision and planning</small>", "Skills HQ<small>Functional Skills, Level 1</small>")
    s = s.replace("EGW's GCSE HQ", "LW's Skills HQ").replace(" - EGW GCSE HQ", " - LW Skills HQ")
    s = s.replace('"base5.who.v1", "EGW"', '"base5.who.v1", "LW"')
    s = re.sub(r"/egw/(?!" + SHARED + ")", "/lw/", s)
    s = s.replace("b5.egw.", "b5.lw.")
    s = s.replace('filename: "egw-', 'filename: "lw-')
    s = re.sub(r'/lw/catalogue\.js\?v=\d+', "/lw/catalogue.js?v=" + CAT_V, s)
    s = re.sub(r'/lw/(daily|swipe)-bank-(maths|english)\.js\?v=\d+', r"/lw/\1-bank-\2.js?v=" + BANK_V, s)
    s = re.sub(r"\bEGW\b(?![.\w])", "LW", s)
    s = s.replace("b5.egwteacher.", "b5.lwteacher.").replace("EGWJAY1", "LWJAY1").replace("EGWSAVE1", "LWSAVE1")
    s = s.replace("GCSE HQ", "Skills HQ")
    return s


def hub_patches(name, s):
    if name == "index.html":
        s = re.sub(r"\n\s*ideas\.push\('<a href=\"/lw/mark-jay\.html\">.*?\);", "", s, count=1)
        # Showstopper, LW's pop up rhythm game (/lw/showstopper.js, LW's own file)
        s = must(s, '<script src="/data/send.js"></script>', '<script src="/data/send.js"></script>\n<script src="/data/hqgame.js?v=1"></script>\n<script src="/lw/showstopper.js?v=1"></script>\n<script src="/data/hqbreak.js?v=4"></script>\n<script src="/lw/break.js?v=1"></script>', 1, name)
        if "mark-jay" in s:
            sys.exit("build_lw: mark-jay link still in index")
        s = must(s, 'english: "Reading closely, writing to describe, and writing to win an argument."',
                 'english: "Reading everyday texts, writing letters, emails and reports, and talking it through."', 1, name)
        s = must(s, 'maths: "Foundation papers, with stretch towards grade 5."',
                 'maths: "Everyday maths: money, time, measures, data, and showing your working."', 1, name)
        a = s.index('<a href="/practice/gcse-foundation-paper-1.html">')
        b = s.index('<a href="/practice/#english-gcse">')
        b = s.index("</a>", b) + 4
        s = s[:a] + ('<a href="/practice/maths-level-1.html"><b>Maths Level 1 paper</b><span>Pearson, whole paper</span></a>\n'
                     '      <a href="/practice/ice-cream-bike.html"><b>Reading Level 1 paper</b><span>City &amp; Guilds sample</span></a>\n'
                     '      <a href="/practice/writing-level-1.html"><b>Writing Level 1 paper</b><span>City &amp; Guilds sample</span></a>\n'
                     '      <a href="/practice/punctuation.html"><b>Punctuation</b><span>English drills</span></a>') + s[b:]
    if name == "daily.html":
        for sub in ("bio", "stats"):
            s = re.sub(r'<script src="/lw/daily-bank-%s\.js\?v=\d+"></script>\n' % sub, "", s)
        s = must(s, 'var CYCLE = ["maths", "english", "bio", "stats"];', 'var CYCLE = ["maths", "english"];', 1, name)
        s = re.sub(r'var START = "\d{4}-\d\d-\d\d";', 'var START = "2026-10-13";', s)
        s = must(s, "One question a day, from any of your four subjects.", "One question a day, English or Maths.", 1, name)
        s = s.replace('seeded("egw-daily-"', 'seeded("lw-daily-"')
    if name == "swipe.html":
        for sub in ("bio", "stats"):
            s = re.sub(r'<script src="/lw/swipe-bank-%s\.js\?v=\d+"></script>\n' % sub, "", s)
        s = must(s, '["mixed", "maths", "english", "bio", "stats"].forEach', '["mixed", "maths", "english"].forEach', 1, name)
        s = must(s, "(maths|english|bio|stats)", "(maths|english)", 1, name)
        s = must(s, 'maths: "#ffd23f", english: "#ff5d5d"', 'maths: "#2ed3c6", english: "#ffc53d"', 1, name)
    if name == "sky.html":
        s = must(s, 'english: "#ff7a7a", maths: "#ffd23f"', 'english: "#ffc53d", maths: "#2ed3c6"', 1, name)
    if name == "teacher.html":
        # LW is he; Jay's view talks about the student
        for a, b in [
            ("Her progress is saved on her own device. When she taps", "His progress is saved on his own device. When he taps"),
            ("on her HQ page", "on his HQ page"),
            ("to see where she is.", "to see where he is."),
            ("Show her progress", "Show his progress"),
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
            sys.exit("build_lw: pronouns left in teacher.html: %r" % left[:5])
    return s


def main():
    written = []
    for name in HUBS:
        s = open(os.path.join(EGW, name)).read()
        s = common(s, name)
        s = hub_patches(name, s)
        s = must(s, "<!DOCTYPE html>\n", "<!DOCTYPE html>\n<!-- BUILT by lw/_build/build_lw.py from the shared HQ page. Edit the source and rebuild. -->\n", 1, name)
        if re.search(r"[^\x00-\x7f]", s):
            sys.exit("build_lw: non ASCII in " + name)
        open(os.path.join(LW, name), "w").write(s)
        written.append(name)
    print("build_lw: wrote %d hub pages to /lw/: %s" % (len(written), ", ".join(written)))


if __name__ == "__main__":
    main()
