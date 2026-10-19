#!/usr/bin/env python3
"""
Walks every Autumn 2 activity page in a real (headless) browser.

For each page and each level: Begin, then every step in turn. Right
answers are typed or tapped for mc, multi, num and text, and must be
marked right; everything else is skipped through. Then the finish card
must show the made thing, and switching level and theme mid-activity
must not break anything. Any console error fails the page.

    python3 data/a2/_build/walk.py [slug ...]      (server on :8123)
ASCII only.
"""
import json, os, re, subprocess, sys, time, threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)
import plan

PORT = int(os.environ.get("WALK_PORT", "8123"))
BASES = {"EGW": "egw", "LP": "lp", "LW": "lw", "LC": "lc", "HK": "hk", "JT": "jt-hq"}

RESOLVE_JS = r"""
(slug) => {
  const p = window.A2PACKS[slug];
  const st = JSON.parse(localStorage.getItem(window.HQ ? window.HQ.prefix + p.id + ".v1" : "b5.egw." + p.id + ".v1") || "null");
  const lv = st.level, th = st.theme;
  function tok(v){
    if(typeof v === "string"){ const t = p.themes && th && p.themes[th]; return v.replace(/\[\[([a-zA-Z0-9_]+)\]\]/g, (m,k) => { if(t && t.w && t.w[k] != null) return t.w[k]; const lo = k.charAt(0).toLowerCase() + k.slice(1); if(t && t.w && t.w[lo] != null){ const x = String(t.w[lo]); return x.charAt(0).toUpperCase() + x.slice(1); } return k; }); }
    if(Array.isArray(v)) return v.map(tok);
    if(v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype){ const o = {}; Object.keys(v).forEach(k => o[k] = tok(v[k])); return o; }
    return v;
  }
  const raw = p.steps[st.pos], o = {};
  Object.keys(raw).forEach(k => { if(k !== "lv") o[k] = raw[k]; });
  if(raw.lv && raw.lv[lv]) Object.keys(raw.lv[lv]).forEach(k => o[k] = raw.lv[lv][k]);
  const out = {};
  Object.keys(o).forEach(k => { if(typeof o[k] !== "function") out[k] = tok(o[k]); });
  const d = document.createElement("div");
  const strip = h => { d.innerHTML = h; return (d.textContent || "").replace(/\s+/g, " ").trim(); };
  if(out.options) out._opts = out.options.map(strip);
  if(out.model) out._model = strip(out.model);
  out._pos = st.pos; out._lv = lv; out._th = th;
  return out;
}
"""


def serve():
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self, *a, **k):
            pass
    handler = partial(Quiet, directory=ROOT)
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def visible(page, sel):
    el = page.query_selector(sel)
    return bool(el and el.is_visible())


def walk(page, url, slug, problems, level):
    page.goto(url + ("&" if "?" in url else "?") + "lv=" + level)
    page.wait_for_selector("#beginBtn", timeout=15000)
    page.click("#beginBtn")
    answered = 0
    for _ in range(400):
        if visible(page, "#resultCard"):
            break
        if visible(page, "#chunkCard"):
            page.click("#nextChunkBtn")
            continue
        s = page.evaluate(RESOLVE_JS, slug)
        t = s["type"]
        where = "%s [%s] step %d (%s)" % (url, level, s["_pos"], t)
        if t == "learn":
            for _k in range(6):
                if visible(page, ".readon .linkish"):
                    page.click(".readon .linkish")
            if s.get("routes"):
                for b in page.query_selector_all(".a2routes button"):
                    b.click()
            page.click("#nextBtn")
            continue
        did = False
        if t == "mc":
            want = s["_opts"][s["answer"]]
            for b in page.query_selector_all(".choices button"):
                if re.sub(r"\s+", " ", b.text_content()).strip() == want:
                    b.click(); did = True; break
            if not did:
                problems.append(where + ": could not find the right option " + want)
        elif t == "multi":
            for k in s["answers"]:
                want = s["_opts"][k]
                for b in page.query_selector_all(".choices button"):
                    if re.sub(r"\s+", " ", b.text_content()).strip() == want:
                        b.click(); break
            did = True
        elif t == "num":
            ins = page.query_selector_all(".numboxes input")
            for k, bx in enumerate(s["boxes"]):
                ins[k].fill(str(bx["a"]))
            did = True
        elif t == "text":
            page.fill("textarea.shortans", s.get("_model", ""))
            did = True
        if did:
            if page.query_selector(".a2sure button[data-s=certain]") and answered % 3 == 0:
                page.click(".a2sure button[data-s=certain]")
            page.click("#checkBtn")
            cls = page.get_attribute("#qFb", "class") or ""
            if "good" not in cls:
                problems.append(where + ": right answer not marked right: " + (page.text_content("#qFb") or "")[:160])
                if visible(page, "#showBtn"):
                    page.click("#showBtn")
                elif visible(page, "#checkBtn"):
                    page.click("#checkBtn")
                    if visible(page, "#showBtn"):
                        page.click("#showBtn")
            answered += 1
            if visible(page, "#a2Why"):
                page.click("#a2Why summary")
                page.fill("#a2Why textarea", "I counted.")
            page.click("#nextBtn")
            continue
        # sort, order, match, write, widget, mark: move on
        if visible(page, "#skipBtn"):
            page.click("#skipBtn")
        elif visible(page, "#nextBtn"):
            page.click("#nextBtn")
        else:
            problems.append(where + ": stuck, no way on")
            return
    else:
        problems.append(url + " [" + level + "]: never reached the finish")
        return
    if not page.query_selector("#a2Make .a2preview svg"):
        problems.append(url + " [" + level + "]: no made thing on the finish card")
    if not page.query_selector("#a2Real .a2real"):
        problems.append(url + " [" + level + "]: no 'where you would use this' on the finish card")
    page.click("#a2Fill")
    # switch level and theme mid-activity
    page.click("#againBtn")
    chips = page.query_selector_all(".a2bar-start .a2chip[data-lv]")
    for c in chips:
        c.click()
    for c in page.query_selector_all(".a2bar-start .a2chip[data-th]"):
        c.click()
    page.click("#resumeBtn")
    page.click("details.a2qset summary")
    for c in page.query_selector_all(".a2bar-q .a2chip"):
        c.click()


def main():
    only = sys.argv[1:]
    srv = serve()
    problems = []
    pages = 0
    with sync_playwright() as p:
        b = p.chromium.launch()
        for slug, title, subject, covers in plan.ACTS:
            if only and slug not in only:
                continue
            if not os.path.exists(os.path.join(ROOT, "data", "a2", slug + ".js")):
                continue
            whos = sorted(set(c[0] for c in covers))
            # every assigned HQ loads; the full walk runs in one HQ per level
            for k, who in enumerate(whos):
                ctx = b.new_context(viewport={"width": 1100, "height": 900})
                ctx.route(re.compile(r"^https?://(?!127\.0\.0\.1)"), lambda r: r.abort())
                ctx.add_init_script("try{localStorage.setItem('b5.sync.off','1')}catch(e){}")
                page = ctx.new_page()
                errs = []
                page.on("pageerror", lambda e, w=who: errs.append("pageerror: " + str(e)))
                page.on("console", lambda m: errs.append("console: " + m.text) if m.type == "error" and "net::ERR" not in m.text and "Failed to load resource" not in m.text else None)
                url = "http://127.0.0.1:%d/%s/a2-%s.html" % (PORT, BASES[who], slug)
                levels = ["mild", "medium", "spicy"] if k == 0 else [["mild", "medium", "spicy"][k % 3]]
                for lv in levels:
                    try:
                        walk(page, url, slug, problems, lv)
                    except Exception as e:
                        problems.append("%s [%s]: %s" % (url, lv, str(e).split("\n")[0][:200]))
                    page.evaluate("localStorage.clear(); localStorage.setItem('b5.sync.off','1')")
                for e in errs:
                    problems.append(url + ": " + e[:300])
                pages += 1
                ctx.close()
            print("walked " + slug, flush=True)
        b.close()
    srv.shutdown()
    print("\n%d pages walked, %d problems" % (pages, len(problems)))
    for pr in problems[:200]:
        print(" x " + pr)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
