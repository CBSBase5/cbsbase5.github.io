#!/usr/bin/env python3
"""
Builds LP's GCSE HQ (/lp/) from EGW's (/egw/).

LP is on the same GCSEs as EGW in English and Maths (AQA English Language,
Edexcel Maths Foundation), so the activities are shared. This script copies
the English and Maths pages, the two matching escape rooms and the hub
pages, and gives them LP's name, links, storage keys and look.

Shared code stays in /egw/ and is loaded from there: engine.js, progress.js,
skin.js, egw.css and the daily drop and swipe card banks. They read
window.HQ from /lp/conf.js. LP's own look is /lp/lp.css.

Run it again after changing any of EGW's English or Maths pages:
    python3 lp/_build/build_lp.py
(from the repo root). It needs node for the catalogue. Files written by this
script should not be edited by hand; edit the EGW page and rebuild.
Jekyll does not publish folders starting with _ so this script stays private.
"""
import json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EGW = os.path.join(ROOT, "egw")
LP = os.path.join(ROOT, "lp")

SUBJECTS = ["english", "maths"]
EXTRAS = ["escape-maths", "escape-english"]
HUBS = ["index.html", "papers.html", "sky.html", "daily.html", "swipe.html", "bonnie.html", "looks.html"]
SHARED = r"(engine\.js|skin\.js|progress\.js|egw\.css|daily-bank-|swipe-bank-)"
LP_CSS = "/lp/lp.css?v=1"
CONF = "/lp/conf.js?v=1"
CAT_V = "1"


def must(s, a, b, count=None, where=""):
    n = s.count(a)
    if n == 0 or (count is not None and n != count):
        sys.exit("build_lp: expected %s of %r in %s, found %d" % (count or "some", a[:70], where, n))
    return s.replace(a, b)


def common(s, name):
    # config first, then LP's stylesheet straight after the shared one
    s = must(s, '<link rel="stylesheet" href="/egw/egw.css', '<script src="%s"></script>\n<link rel="stylesheet" href="/egw/egw.css' % CONF, 1, name)
    s = re.sub(r'(<link rel="stylesheet" href="/egw/egw\.css\?v=\d+">)', r'\1\n<link rel="stylesheet" href="%s">' % LP_CSS, s, count=1)
    # LP's heading font
    s = must(s, "&display=swap", "&family=Chakra+Petch:wght@500;600;700&display=swap", None, name)
    # name and initials
    s = s.replace('<span class="hqlogo">EGW</span>', '<span class="hqlogo">LP</span>')
    s = s.replace("EGW's GCSE HQ", "LP's GCSE HQ").replace(" - EGW GCSE HQ", " - LP GCSE HQ")
    s = s.replace('"base5.who.v1", "EGW"', '"base5.who.v1", "LP"')
    # links: everything in /egw/ becomes /lp/, except the shared code
    s = re.sub(r"/egw/(?!" + SHARED + ")", "/lp/", s)
    # storage keys written directly in a page
    s = s.replace("b5.egw.", "b5.lp.")
    s = s.replace('filename: "egw-', 'filename: "lp-')
    # catalogue: LP's own
    s = re.sub(r'/lp/catalogue\.js\?v=\d+', "/lp/catalogue.js?v=" + CAT_V, s)
    # any other EGW in words (EGW.run, EGWCAT and friends are left alone)
    s = re.sub(r"\bEGW\b(?![.\w])", "LP", s)
    return s


def hub_patches(name, s):
    if name == "index.html":
        # no Jay's view for LP: plain summary only
        s = must(s, ' &middot; <a href="/lp/teacher.html">Jay\'s view</a>', "", 1, name)
        s = must(s, "<small>Only if you want to: how things are going, with a progress code for Jay's view.</small>",
                 "<small>Only if you want to: a quick note to Jay on how things are going.</small>", 1, name)
        s = must(s, '  lines.push("");\n  lines.push("== For Jay\'s view ==");\n  lines.push("Paste this whole email at cbsbase5.github.io/lp/teacher.html");\n  lines.push(jayCode || EGWPROG.encodeSync("JAY", EGWPROG.report()));\n', "", 1, name)
        # Mark Jay's work is a mixed four subject extra, not in LP's HQ
        s = re.sub(r"\n\s*ideas\.push\('<a href=\"/lp/mark-jay\.html\">.*?\);", "", s, count=1)
        if "mark-jay" in s:
            sys.exit("build_lp: mark-jay link still in index")
    if name == "daily.html":
        for sub in ("bio", "stats"):
            s = re.sub(r'<script src="/egw/daily-bank-%s\.js\?v=\d+"></script>\n' % sub, "", s)
        s = must(s, 'var CYCLE = ["maths", "english", "bio", "stats"];', 'var CYCLE = ["maths", "english"];', 1, name)
        s = re.sub(r'var START = "\d{4}-\d\d-\d\d";', 'var START = "2026-10-09";', s)
    if name == "daily.html":
        s = must(s, "One question a day, from any of your four subjects.", "One question a day, English or Maths.", 1, name)
    if name == "sky.html":
        s = must(s, 'english: "#ff7a7a", maths: "#ffd23f"', 'english: "#ff6fa0", maths: "#c6f03c"', 1, name)
    if name == "swipe.html":
        s = must(s, 'maths: "#ffd23f", english: "#ff5d5d"', 'maths: "#c6f03c", english: "#ff4f8b"', 1, name)
        for sub in ("bio", "stats"):
            s = re.sub(r'<script src="/egw/swipe-bank-%s\.js\?v=\d+"></script>\n' % sub, "", s)
        s = must(s, '["mixed", "maths", "english", "bio", "stats"].forEach', '["mixed", "maths", "english"].forEach', 1, name)
        s = must(s, "(maths|english|bio|stats)", "(maths|english)", 1, name)
    return s


def catalogue():
    js = r"""
global.window = {}; global.localStorage = { getItem: function(){ return null; } };
eval(require("fs").readFileSync(process.argv[1], "utf8"));
var keep = %s, extras = %s;
var out = {
  acts: EGWCAT.acts.filter(function(a){ return keep.indexOf(a.subject) >= 0; }),
  subjects: EGWCAT.subjects.filter(function(s){ return keep.indexOf(s.key) >= 0; }),
  extras: (EGWCAT.extras || []).filter(function(a){ return extras.indexOf(a.id) >= 0; })
};
process.stdout.write(JSON.stringify(out));
""" % (json.dumps(SUBJECTS), json.dumps(EXTRAS))
    data = json.loads(subprocess.check_output(["node", "-e", js, os.path.join(EGW, "catalogue.js")]))
    src = open(os.path.join(EGW, "catalogue.js")).read()
    helpers = src[src.index("/* Small helpers"):]
    def dump(x):
        return json.dumps(x, indent=1, ensure_ascii=True)
    body = ("/* LP's GCSE HQ - catalogue. BUILT by lp/_build/build_lp.py from\n"
            "   /egw/catalogue.js (English and Maths only). Do not edit by hand. */\n"
            "var EGWCAT = {};\n"
            "EGWCAT.acts = " + dump(data["acts"]) + ";\n\n"
            "EGWCAT.subjects = " + dump(data["subjects"]) + ";\n\n"
            "EGWCAT.extras = " + dump(data["extras"]) + ";\n\n" + helpers)
    body = re.sub(r"\bEGW\b(?![.\w])", "LP", body)
    if len(data["acts"]) == 0 or len(data["subjects"]) != len(SUBJECTS):
        sys.exit("build_lp: catalogue filter came out wrong")
    return body, data


def main():
    body, data = catalogue()
    open(os.path.join(LP, "catalogue.js"), "w").write(body)
    pages = [a["id"] + ".html" for a in data["acts"]] + [x + ".html" for x in EXTRAS]
    written = ["catalogue.js"]
    for name in pages + HUBS:
        s = open(os.path.join(EGW, name)).read()
        s = common(s, name)
        s = hub_patches(name, s)
        s = must(s, "<!DOCTYPE html>\n", "<!DOCTYPE html>\n<!-- BUILT by lp/_build/build_lp.py from the shared HQ page. Edit the source and rebuild. -->\n", 1, name)
        if re.search(r"[^\x00-\x7f]", s):
            sys.exit("build_lp: non ASCII in " + name)
        open(os.path.join(LP, name), "w").write(s)
        written.append(name)
    print("build_lp: wrote %d files to /lp/: %s" % (len(written), ", ".join(written)))


if __name__ == "__main__":
    main()
