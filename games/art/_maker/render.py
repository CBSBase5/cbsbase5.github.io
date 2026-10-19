"""Render box art: python3 render.py OUTDIR id [id ...]   (needs http server on :8790 at scratchpad root)"""
import sys, os, asyncio
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright
from geom import FRONT, SPINE, W2, H2, warp_onto

OUT = sys.argv[1] if len(sys.argv) > 1 else "."; IDS = sys.argv[2:]
BASE = "http://localhost:8790/tools/cover.html"


async def flats(ids):
    res = {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for gid in ids:
            res[gid] = {}
            for mode, sel, w in (("front", "#front", 760), ("spine", "#spine", 110)):
                pg = await b.new_page(viewport={"width": 800, "height": 1100}, device_scale_factor=2)
                extra = os.environ.get("SHOTQ", "")
                await pg.goto(f"{BASE}?id={gid}&mode={mode}{extra}")
                await pg.wait_for_selector("body[data-ready='1']")
                await pg.wait_for_timeout(300)
                path = f"{OUT}/{gid}-{mode}.png"
                await pg.locator(sel).screenshot(path=path, omit_background=True)
                res[gid][mode] = path
                await pg.close()
        await b.close()
    return res


def light(img, kind):
    a = np.array(img.convert("RGBA")).astype(float)
    h, w = a.shape[:2]
    if kind == "front":
        u = np.linspace(0, 1, w)[None, :, None]
        f = 1.0 - 0.13 * u
        a[:, :, :3] *= f
    else:
        f = np.full((1, w, 1), 0.9)
        f[:, int(w * 0.915):, :] = 0.95   # colour stripe on the front edge stays bright
        a[:, :, :3] *= f
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")


def compose(front, spine, out_base, lit=True):
    if lit:
        front, spine = light(front, "front"), light(spine, "spine")
    S = 2  # supersample 4x relative to 1x (2 relative to 2x)
    size = (W2 * S, H2 * S)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.alpha_composite(warp_onto(spine, SPINE, size, S))
    canvas.alpha_composite(warp_onto(front, FRONT, size, S))
    two = canvas.resize((W2, H2), Image.LANCZOS)
    one = canvas.resize((W2 // 2, H2 // 2), Image.LANCZOS)
    os.makedirs(os.path.dirname(out_base), exist_ok=True)
    one.save(out_base + ".webp", "WEBP", quality=86, method=6)
    two.save(out_base + "@2x.webp", "WEBP", quality=86, method=6)
    return out_base


def compose_raw(f, s, out):
    return compose(f, s, out, lit=False)


if __name__ == "__main__":
    fl = asyncio.run(flats(IDS))
    for gid in IDS:
        f = Image.open(fl[gid]["front"]); s = Image.open(fl[gid]["spine"])
        print(gid, f.size, s.size, compose(f, s, f"{OUT}/{gid}/box"))
