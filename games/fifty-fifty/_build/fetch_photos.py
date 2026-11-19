#!/usr/bin/env python3
"""
Fifty Fifty: download the quiz photos from Wikipedia into the repo.

Runs on GitHub (see .github/workflows/fifty-fifty-photos.yml) because
GitHub can reach Wikipedia even when school wifi or a build machine
cannot. For every article title in photos.txt it finds the article's
main picture, downloads it at up to 1600 pixels wide, and records who
made it and under which licence.

Output (not published, Jekyll skips folders starting with _):
  games/fifty-fifty/_build/raw/<slug>.<ext>
  games/fifty-fifty/_build/raw/credits.json
The cropped, board ready versions in games/fifty-fifty/img/ are made
from these by crop_photos.py.
Plain ASCII only.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
API = "https://en.wikipedia.org/w/api.php"
UA = "Base5SchoolQuiz/1.0 (https://cbsbase5.github.io; school classroom quiz)"

def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")

def get(params):
    params = dict(params, format="json", formatversion="2")
    url = API + "?" + urllib.parse.urlencode(params)
    for i in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            print("retry", i, e); time.sleep(2 + i * 3)
    raise SystemExit("API failed")

def strip_tags(h):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", h or "")).strip()

def main():
    os.makedirs(RAW, exist_ok=True)
    titles = [l.strip() for l in open(os.path.join(HERE, "photos.txt")) if l.strip()]
    files = {}
    for i in range(0, len(titles), 40):
        chunk = titles[i:i + 40]
        j = get({"action": "query", "prop": "pageimages", "piprop": "name", "redirects": "1", "titles": "|".join(chunk)})
        q = j.get("query", {})
        m = {t: t for t in chunk}
        for n in q.get("normalized", []) + q.get("redirects", []):
            for k in m:
                if m[k] == n["from"]: m[k] = n["to"]
        by = {p["title"]: p.get("pageimage") for p in q.get("pages", [])}
        for k in chunk:
            if by.get(m[k]): files[k] = by[m[k]]
            else: print("NO IMAGE:", k)
    credits = {}
    names = list(set(files.values()))
    info = {}
    for i in range(0, len(names), 40):
        chunk = names[i:i + 40]
        j = get({"action": "query", "prop": "imageinfo", "iiprop": "url|extmetadata|mime", "iiurlwidth": "1600",
                 "titles": "|".join("File:" + n for n in chunk)})
        q = j.get("query", {})
        norm = {n["to"]: n["from"] for n in q.get("normalized", [])}
        for p in q.get("pages", []):
            ii = (p.get("imageinfo") or [{}])[0]
            name = p["title"]
            info[norm.get(name, name)[5:]] = ii
    for t, f in sorted(files.items()):
        ii = info.get(f) or info.get(f.replace("_", " ")) or {}
        url = ii.get("thumburl") or ii.get("url")
        if not url: print("NO URL:", t, f); continue
        ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower() or ".jpg"
        out = os.path.join(RAW, slug(t) + ext)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r, open(out, "wb") as fh:
                fh.write(r.read())
        except Exception as e:
            print("DOWNLOAD FAILED:", t, e); continue
        md = ii.get("extmetadata") or {}
        credits[t] = {
            "slug": slug(t), "raw": os.path.basename(out), "file": f,
            "page": ii.get("descriptionurl", ""),
            "artist": strip_tags((md.get("Artist") or {}).get("value", ""))[:120],
            "licence": strip_tags((md.get("LicenseShortName") or {}).get("value", ""))[:60],
        }
        print("ok", t, "->", os.path.basename(out))
        time.sleep(0.3)
    with open(os.path.join(RAW, "credits.json"), "w", encoding="ascii") as fh:
        json.dump(credits, fh, indent=1, ensure_ascii=True, sort_keys=True)
    print(len(credits), "of", len(titles), "photos")

if __name__ == "__main__":
    main()
