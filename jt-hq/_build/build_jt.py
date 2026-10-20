#!/usr/bin/env python3
"""
Builds JT's Training Ground (/jt-hq/) from LC's Night Shift HQ (/lc/).

JT works on the same English and Maths targets as LC (English Foundation 1
to 2, Maths Foundation 2 to 3, from Jay's baselines, no exam), so every
page is shared: activities, escape rooms, hub pages, Jay's view and the
catalogue are copied from /lc/ and given JT's name, links, storage keys
and look. The daily drop and swipe card banks are loaded from /lc/ as they
are. JT has no jumpscare. JT's own files (not built): the two football
escape rooms, the penalty shootout pop up game (/jt-hq/penalty.js),
conf.js and jt.css. JT's Dugout (/jt/) is separate and untouched; this
space stores under b5.jthq. so the two never share data.

Run from the repo root after LC's pages change (and after
python3 lc/_build/build_lc.py if EGW's hub pages changed):
    python3 jt-hq/_build/build_jt.py
Files written by this script should not be edited by hand.
Jekyll does not publish folders starting with _ so this stays private.
"""
import os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LC = os.path.join(ROOT, "lc")
JT = os.path.join(ROOT, "jt-hq")
OWN = {"conf.js", "jt.css", "penalty.js", "escape-english.html", "escape-maths.html"}
JT_CSS = "/jt-hq/jt.css?v=1"
FONTS = "&family=Oswald:wght@500;600;700"
CROSSY = '<script src="/jt-hq/penalty.js?v=1"></script>\n<script src="/data/hqbreak.js?v=3"></script>\n<script src="/jt-hq/break.js?v=1"></script>'


def must(s, a, b, count=None, where=""):
    n = s.count(a)
    if n == 0 or (count is not None and n != count):
        sys.exit("build_jt: expected %s of %r in %s, found %d" % (count or "some", a[:70], where, n))
    return s.replace(a, b)


def convert(s, name):
    s = re.sub(r'/lc/conf\.js\?v=\d+', "/jt-hq/conf.js?v=1", s)
    s = re.sub(r'/lc/lc\.css\?v=\d+', JT_CSS, s)
    s = s.replace("&family=Space+Mono:wght@400;700", FONTS)
    # no jumpscares for JT
    s = re.sub(r'<script src="/lc/jumpscare\.js[^"]*"[^>]*></script>\n?', "", s)
    # nor LC's night shift scene, corridor game or the drawings it borrows
    s = re.sub(r'<script src="/lc/(night|corridor)\.js[^"]*"></script>\n?', "", s)
    s = re.sub(r'<script src="/data/a2/art\.js[^"]*"></script>\n?', "", s)
    # and LC's earned-scares gate; this HQ adds its own game and gate
    s = re.sub(r'<script src="/data/hqbreak\.js[^"]*"></script>\n?', "", s)
    s = re.sub(r'<script src="/lc/break\.js[^"]*"></script>\n?', "", s)
    # links: everything in /lc/ becomes /jt-hq/, except the shared question banks
    s = re.sub(r"/lc/(?!(daily|swipe)-bank-)", "/jt-hq/", s)
    s = s.replace("b5.lc.", "b5.jthq.").replace("b5.lcteacher.", "b5.jthqteacher.")
    s = s.replace("LCJAY1", "JTJAY1").replace("LCSAVE1", "JTSAVE1")
    s = s.replace('filename: "lc-', 'filename: "jt-').replace('seeded("lc-daily-"', 'seeded("jt-daily-"')
    s = s.replace("LC's Night Shift HQ", "JT's Training Ground").replace("LC Night Shift HQ", "JT Training Ground")
    s = s.replace("Night Shift HQ", "Training Ground")
    s = re.sub(r"\bLC\b(?![.\w])", "JT", s)
    s = re.sub(r"<!-- BUILT by lc/_build/build_lc\.py[^>]*-->\n", "", s)
    s = must(s, "<!DOCTYPE html>\n", "<!DOCTYPE html>\n<!-- BUILT by jt-hq/_build/build_jt.py from a shared HQ page. Edit the source and rebuild. -->\n", 1, name) if name.endswith(".html") else s
    if name == "index.html":
        s = must(s, '<script src="/data/send.js"></script>', '<script src="/data/send.js"></script>\n' + CROSSY, 1, name)
        s = re.sub(r'var START = "\d{4}-\d\d-\d\d";', 'var START = "2026-10-14";', s)
    if name == "daily.html":
        s = re.sub(r'var START = "\d{4}-\d\d-\d\d";', 'var START = "2026-10-14";', s)
    if name == "teacher.html":
        # Jay's view talks about JT as "they" (no pronoun assumed)
        for a, b in [
            ("JT's progress is saved on his own device. When he taps", "JT's progress is saved on their own device. When they tap"),
            ("on his HQ page", "on their HQ page"),
            ("to see where he is.", "to see where they are."),
            ("sends his progress", "sends their progress"),
            ("Where he leaned on Show me most", "Where they leaned on Show me most"),
            ("His ratings here were made", "Their ratings here were made"),
            ("rated by him,", "rated by them,"),
            ("His rating", "Their rating"),
            ("the last time he saw them", "the last time they saw them"),
            ("Things he noted to remember", "Things they noted to remember"),
        ]:
            s = must(s, a, b, None, name)
        left = re.findall(r"[^/*\n]{0,30}\b(?:he|his|him|she|her)\b", re.sub(r"/\*.*?\*/", "", s, flags=re.S))
        if left:
            sys.exit("build_jt: pronouns left in teacher.html: %r" % left[:5])
    if "jumpscare" in s.lower():
        sys.exit("build_jt: jumpscare left in " + name)
    if re.search(r"/lc/(?!(daily|swipe)-bank-)", s):
        sys.exit("build_jt: an /lc/ link is left in " + name)
    return s


def swap_extras(s):
    """JT's escape rooms are football ones, with their own rooms."""
    for a, b in [
        ('"title": "Escape the empty mall"', '"title": "Escape the stadium"'),
        ('"line": "Locked in after closing time. Four rooms, one digit each."', '"line": "Locked in after the final whistle. Four rooms, one digit each."'),
        ('"title": "Escape the night bus"', '"title": "Escape the training ground"'),
        ('"line": "Woken up in the empty bus depot. Four rooms, one digit each."', '"line": "Last one at training and the gates lock. Four rooms, one digit each."'),
        ('"Food court",\n   "Toy shop",\n   "Security office",\n   "Lift",', '"Ticket office",\n   "Dressing room",\n   "Press room",\n   "Tunnel",'),
        ('"The bus",\n   "Ticket machine",\n   "Lost property",\n   "Garage",', '"Kit room",\n   "Gym",\n   "Team bus",\n   "Club shop",'),
    ]:
        s = must(s, a, b, 1, "catalogue.js")
    return s


def main():
    written = []
    for name in sorted(os.listdir(LC)):
        path = os.path.join(LC, name)
        if not os.path.isfile(path) or name in OWN:
            continue
        if name.startswith("a2-"):
            continue   # Autumn 2 activities are built per student by data/a2/_build/build_a2.py
        if not (name.endswith(".html") or name == "catalogue.js"):
            continue
        s = open(path).read()
        s = convert(s, name)
        if name == "catalogue.js":
            s = swap_extras(s)
            s = s.replace("LC's Night Shift HQ - catalogue", "JT's Training Ground - catalogue")
            s = s.replace("   Written by hand, not built.", "   BUILT by jt-hq/_build/build_jt.py from a shared catalogue. Do not edit by hand.")
        if re.search(r"[^\x00-\x7f]", s):
            sys.exit("build_jt: non ASCII in " + name)
        open(os.path.join(JT, name), "w").write(s)
        written.append(name)
    print("build_jt: wrote %d files to /jt-hq/: %s" % (len(written), ", ".join(written)))


if __name__ == "__main__":
    main()
