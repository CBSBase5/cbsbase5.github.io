#!/usr/bin/env python3
"""
Fifty Fifty: turn the downloaded photos into board ready pictures.

Reads _build/raw/ (from fetch_photos.py) and writes
  games/fifty-fifty/img/<slug>.webp   4:3, 1200 x 900, cropped
  games/fifty-fifty/img/photos.js     the list the quiz reads
Flags keep their whole shape (no crop, transparent background).

FOCUS below moves the crop for photos where the middle is not the
best part: (x, y) from 0 to 1, where the centre of the crop should go.
ZOOM crops tighter (1 = as big as fits, 1.5 = closer in).
Plain ASCII only.
"""
import json, os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
OUT = os.path.abspath(os.path.join(HERE, "..", "img"))
W, H = 1200, 900

FOCUS = {
    "Kidney": (0.62, 0.5), "Violin": (0.29, 0.62), "Burj Khalifa": (0.5, 0.45),
    "Statue of Liberty": (0.47, 0.3), "Lung": (0.5, 0.45), "Gecko": (0.62, 0.45),
}
ZOOM = {
    "Violin": 1.3, "Burj Khalifa": 1.7, "Statue of Liberty": 1.25,
}

def crop43(im, fx, fy, zoom):
    w, h = im.size
    cw, ch = (w, w * 3 / 4) if w / h < 4 / 3 else (h * 4 / 3, h)
    cw, ch = cw / zoom, ch / zoom
    cx = min(max(fx * w, cw / 2), w - cw / 2)
    cy = min(max(fy * h, ch / 2), h - ch / 2)
    return im.crop((int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2)))

def main():
    os.makedirs(OUT, exist_ok=True)
    credits = json.load(open(os.path.join(RAW, "credits.json")))
    manifest = {}
    for t, c in sorted(credits.items()):
        im = Image.open(os.path.join(RAW, c["raw"]))
        flag = t.startswith("Flag of")
        if flag:
            im = im.convert("RGBA")
            im.thumbnail((900, 600), Image.LANCZOS)
            im.save(os.path.join(OUT, c["slug"] + ".webp"), "WEBP", quality=90, method=6)
        else:
            im = im.convert("RGB")
            fx, fy = FOCUS.get(t, (0.5, 0.42 if im.size[1] > im.size[0] * 0.75 else 0.5))
            im = crop43(im, fx, fy, ZOOM.get(t, 1.0)).resize((W, H), Image.LANCZOS)
            im.save(os.path.join(OUT, c["slug"] + ".webp"), "WEBP", quality=82, method=6)
        manifest[t] = {"f": c["slug"] + ".webp", "by": c["artist"], "lic": c["licence"], "page": c["page"]}
    with open(os.path.join(OUT, "photos.js"), "w", encoding="ascii") as fh:
        fh.write("/* Fifty Fifty photos: made by _build/crop_photos.py. Plain ASCII only. */\nwindow.FFPHOTOS = ")
        json.dump(manifest, fh, indent=0, ensure_ascii=True, sort_keys=True)
        fh.write(";\n")
    print(len(manifest), "photos")

if __name__ == "__main__":
    main()
