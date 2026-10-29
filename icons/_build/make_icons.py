#!/usr/bin/env python3
"""
Base 5 tab icons (favicons).

Every page on the site gets a small picture in its browser tab, so students
can spot the right tab on a crowded board or Chromebook. This script draws
them all, in code, as tiny SVG files:

  /icons/<name>.svg       the site, each section and each game in the vault
  /<hq>/favicon.svg       one per student HQ: its initials in its own colour
                          under the orange bridge arch
  /favicon.ico            back up for old browsers (the Base 5 bridge)
  /apple-touch-icon.png   used if someone saves the site to a home screen

All icons are one family with BridgeLink Buddy (/buddy/) and the lunch
ordering page (/lunch/): a light paper tile, teal for the main shape,
orange for the warm accent, ink for small details, cyan now and then, and
Buddy's two dark dot eyes on anything that is a character. Buddy and Lunch
keep their own icons; the Base 5 bridge keeps the design it already had.

Which page wears which icon is decided by its address. The list lives in two
places that must match: ICON_MAP below (used when adding links to pages) and
B5ICON_MAP in /data/b5site.js (which also adds the right icon to any page
that forgot one).

To add an icon for a new game or section:
  1. add a draw entry to ICONS below (64 by 64, keep it bold and simple:
     it is shown at 16 pixels)
  2. add its address to ICON_MAP here and to B5ICON_MAP in /data/b5site.js
  3. run from the repo root:  python3 icons/_build/make_icons.py
     then:                    python3 icons/_build/add_icon_links.py
  4. new pages: put these two lines straight after the <title> line
       <link rel="icon" href="/favicon.ico" sizes="32x32">
       <link rel="icon" href="/icons/<name>.svg" type="image/svg+xml">

Needs cairosvg for the .ico and .png, and fonttools with brotli for the
HQ initials (pip install cairosvg fonttools brotli).
Jekyll does not publish folders starting with _ so this stays private.
Plain ASCII only.
"""
import io, math, os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

INK = "#0a2f38"
TEAL = "#007291"
BRIGHT = "#00a6c9"
ORANGE = "#ef7724"
YELLOW = "#ffc247"
PLUM = "#7b4b8f"
CREAM = "#fef8f4"
GREEN = "#1e9e5a"
BLUE = "#1f6fb8"
PURPLE = "#8a3fa0"
INDIGO = "#4f57ad"


def svg(bg, body, full=False):
    tile = ('<rect width="64" height="64" fill="%s"/>' % bg) if full else \
           ('<rect width="64" height="64" rx="14" fill="%s"/>' % bg)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
            '<defs><clipPath id="t"><rect width="64" height="64" rx="14"/></clipPath></defs>'
            + tile + '<g clip-path="url(#t)">' + body + '</g></svg>\n')


def star(cx, cy, r, fill, points=5, inner=0.45, extra=""):
    pts = []
    for i in range(points * 2):
        a = -math.pi / 2 + i * math.pi / points
        rr = r if i % 2 == 0 else r * inner
        pts.append("%.1f,%.1f" % (cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return '<polygon points="%s" fill="%s"%s/>' % (" ".join(pts), fill, extra)


def wheel():
    cols = [ORANGE, TEAL, YELLOW, "#20adca", INK, "#e3f1f4"]
    out = []
    for i, c in enumerate(cols):
        a0 = math.radians(i * 60 - 90)
        a1 = math.radians((i + 1) * 60 - 90)
        x0, y0 = 32 + 20 * math.cos(a0), 34 + 20 * math.sin(a0)
        x1, y1 = 32 + 20 * math.cos(a1), 34 + 20 * math.sin(a1)
        out.append('<path d="M32 34L%.1f %.1fA20 20 0 0 1 %.1f %.1fZ" fill="%s"/>' % (x0, y0, x1, y1, c))
    out.append('<circle cx="32" cy="34" r="20" fill="none" stroke="%s" stroke-width="3"/>' % INK)
    out.append('<circle cx="32" cy="34" r="5" fill="%s" stroke="%s" stroke-width="2.5"/>' % ("#fffdf8", INK))
    out.append('<path d="M26 6h12l-6 10z" fill="%s" stroke="%s" stroke-width="2" stroke-linejoin="round"/>' % (ORANGE, INK))
    return "".join(out)


def pixels(rows, x0, y0, size, fill):
    out = []
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch == "#":
                out.append('<rect x="%d" y="%d" width="%d" height="%d"/>' % (x0 + i * size, y0 + j * size, size, size))
    return '<g fill="%s">%s</g>' % (fill, "".join(out))


# One family with the Base 5 bridge, BridgeLink Buddy and the lunch
# ordering page: a light paper tile, teal for the main shape, orange for
# the warm accent, ink for small details, cyan now and then, and Buddy's
# two dark dot eyes on anything that is a character.
P = "#fffdf8"    # paper tile, as the Base 5 bridge
T = TEAL         # main shape
O = ORANGE       # accent
K = INK          # details
C = "#20adca"    # Buddy's cyan
TINT = "#e3f1f4" # pale teal fill
Y = YELLOW


def eyes(x1, x2, y, r=2.6):
    return '<circle cx="%s" cy="%s" r="%s" fill="%s"/><circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (x1, y, r, K, x2, y, r, K)


ICONS = {
    # ---------- sections ----------
    "icons/base5": None,   # the existing bridge, see EXISTING below
    "icons/vault": (P,
        '<circle cx="32" cy="32" r="23" fill="%s"/>' % T +
        '<circle cx="32" cy="32" r="16" fill="%s"/>' % P +
        '<path d="M32 32V19M32 32L43.3 38.5M32 32L20.7 38.5" stroke="%s" stroke-width="4.5" stroke-linecap="round"/>' % K +
        '<circle cx="32" cy="32" r="5.5" fill="%s"/>' % O +
        "".join('<circle cx="%.1f" cy="%.1f" r="1.8" fill="%s"/>' % (32 + 19.5 * math.cos(math.radians(a)), 32 + 19.5 * math.sin(math.radians(a)), P) for a in range(22, 360, 45))),
    "icons/practice": (P,
        '<g transform="rotate(-40 32 32)">'
        '<rect x="7" y="25" width="8" height="14" rx="3" fill="%s"/>' % O +
        '<rect x="14" y="25" width="4" height="14" fill="%s"/>' % K +
        '<rect x="17" y="25" width="27" height="14" fill="%s"/>' % T +
        '<path d="M17 32H44" stroke="%s" stroke-width="2" stroke-opacity=".5"/>' % C +
        '<path d="M44 25L57 32L44 39Z" fill="#f3d9b8"/>'
        '<path d="M52.5 29.6L57 32L52.5 34.4Z" fill="%s"/></g>' % K),
    "icons/projects": (P,
        '<path d="M22 15H42V18Q42 26 34.5 32Q42 38 42 46V49H22V46Q22 38 29.5 32Q22 26 22 18Z" fill="%s" stroke="%s" stroke-width="3" stroke-linejoin="round"/>' % (TINT, T) +
        '<path d="M25.5 21H38.5Q37 27 32 30.5Q27 27 25.5 21Z" fill="%s"/>' % O +
        '<path d="M25 46.5Q32 37 39 46.5Z" fill="%s"/>' % O +
        '<rect x="15" y="9" width="34" height="7" rx="3.5" fill="%s"/>' % T +
        '<rect x="15" y="48" width="34" height="7" rx="3.5" fill="%s"/>' % T),
    "icons/staff": (P,
        '<rect x="14" y="13" width="36" height="44" rx="6" fill="%s"/>' % T +
        '<rect x="23" y="8" width="18" height="10" rx="4" fill="%s"/>' % O +
        '<path d="M22 36l7 7 13-15" fill="none" stroke="%s" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>' % P),
    "icons/cc": (P,
        '<rect x="10" y="14" width="44" height="40" rx="8" fill="%s"/>' % TINT +
        '<path d="M10 22a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v4H10Z" fill="%s"/>' % T +
        '<rect x="19" y="8" width="5" height="11" rx="2.5" fill="%s"/>' % K +
        '<rect x="40" y="8" width="5" height="11" rx="2.5" fill="%s"/>' % K +
        star(32, 40.5, 11, O)),
    "icons/parents": (P,
        '<path d="M14 30V54H50V30L32 15Z" fill="%s"/>' % T +
        '<path d="M8 31L32 11L56 31" fill="none" stroke="%s" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' % O +
        '<rect x="27" y="38" width="10" height="16" rx="2.5" fill="%s"/>' % P +
        '<rect x="18" y="34" width="7" height="7" rx="1.5" fill="%s"/>' % C +
        '<rect x="39" y="34" width="7" height="7" rx="1.5" fill="%s"/>' % C),
    "icons/baselines": (P,
        '<rect x="11" y="37" width="11" height="15" rx="3" fill="%s"/>' % C +
        '<rect x="26.5" y="26" width="11" height="26" rx="3" fill="%s"/>' % T +
        '<rect x="42" y="13" width="11" height="39" rx="3" fill="%s"/>' % O +
        '<path d="M8 55H56" stroke="%s" stroke-width="3.5" stroke-linecap="round"/>' % K),
    "icons/trips": (P,
        '<path d="M8 54q9-7 18-2t18 0 12-4" fill="none" stroke="%s" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="1 6.5"/>' % T +
        '<path d="M32 50C21 37 17 31 17 24a15 15 0 0 1 30 0c0 7-4 13-15 26Z" fill="%s"/>' % O +
        '<circle cx="32" cy="24" r="6" fill="%s"/>' % P),
    "icons/tools": (P,
        '<path d="M24 25V20a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5" fill="none" stroke="%s" stroke-width="4.5"/>' % K +
        '<rect x="9" y="24" width="46" height="29" rx="6" fill="%s"/>' % T +
        '<path d="M9 36H55" stroke="%s" stroke-width="2.5"/>' % C +
        '<rect x="27" y="31" width="10" height="9" rx="2.5" fill="%s"/>' % O),
    "icons/wall": (P,
        '<rect x="9" y="11" width="46" height="34" rx="12" fill="%s"/>' % T +
        '<path d="M19 42L16 55L31 44Z" fill="%s"/>' % T +
        '<path d="M26.5 23a5.5 5.5 0 1 1 7.5 5.1c-1.6.7-2 1.8-2 3.6" fill="none" stroke="%s" stroke-width="4" stroke-linecap="round"/>' % P +
        '<circle cx="32" cy="38.5" r="2.7" fill="%s"/>' % O),
    "icons/ideas": (P,
        '<path d="M32 5V10M13 13l3.5 3.5M51 13l-3.5 3.5M6 30h5M53 30h5" stroke="%s" stroke-width="3.5" stroke-linecap="round"/>' % C +
        '<path d="M32 15a14 14 0 0 1 8 25.5V44H24V40.5A14 14 0 0 1 32 15Z" fill="%s"/>' % O +
        '<rect x="24" y="45" width="16" height="5" rx="2" fill="%s"/>' % T +
        '<rect x="26" y="51" width="12" height="5" rx="2" fill="%s"/>' % T),
    "icons/targets": (P,
        '<circle cx="32" cy="32" r="23" fill="%s"/>' % T +
        '<circle cx="32" cy="32" r="16.5" fill="%s"/>' % P +
        '<circle cx="32" cy="32" r="10.5" fill="%s"/>' % O +
        '<circle cx="32" cy="32" r="4.5" fill="%s"/>' % P),

    # ---------- student HQs ----------
    # Initials in the HQ's own colour (the same values as section 18 HQ
    # COLOURS of /style.css) under the orange bridge arch: see hq_icon.

    # ---------- games in the vault ----------
    "icons/its-time": (P,
        '<circle cx="34" cy="30" r="22" fill="%s"/>' % T +
        '<circle cx="35" cy="29" r="15.5" fill="%s"/>' % C +
        '<circle cx="36" cy="28" r="9.5" fill="%s"/>' % O +
        '<circle cx="37" cy="27" r="3.8" fill="%s"/>' % P +
        '<path d="M2 20h7M1 30h8M3 40h6" stroke="%s" stroke-width="3.5" stroke-linecap="round"/>' % K),
    "icons/timeline-tantrum": (P,
        '<circle cx="29" cy="39" r="17" fill="%s"/>' % K +
        '<rect x="33" y="18" width="10" height="9" rx="2" transform="rotate(35 38 22.5)" fill="%s"/>' % K +
        '<path d="M41 19q4-9 11-8" fill="none" stroke="%s" stroke-width="3" stroke-linecap="round"/>' % T +
        star(52, 11, 8, O) +
        '<circle cx="22" cy="33" r="4.5" fill="%s" fill-opacity=".35"/>' % P),
    "icons/build-a-life": (P, wheel()),
    "icons/hooked": (P,
        '<path d="M32 3V22" stroke="%s" stroke-width="2"/>' % K +
        '<path d="M21 32a11 11 0 0 1 22 0Z" fill="%s"/>' % O +
        '<path d="M21 32a11 11 0 0 0 22 0Z" fill="%s"/>' % P +
        '<circle cx="32" cy="32" r="11" fill="none" stroke="%s" stroke-width="2.5"/>' % K +
        '<rect x="30.5" y="16" width="3" height="6" rx="1.5" fill="%s"/>' % O +
        '<path d="M5 49q6-5 12 0t12 0 12 0 12 0 12 0M1 58q6-5 12 0t12 0 12 0 12 0 12 0" fill="none" stroke="%s" stroke-width="3.5" stroke-linecap="round"/>' % T),
    "icons/endorphin-house": (P,
        '<path d="M32 53C13 41 10 28 18 21C24 16 31 19 32 25C33 19 40 16 46 21C54 28 51 41 32 53Z" fill="%s"/>' % O +
        eyes(26, 38, 33, 2.8) +
        '<path d="M28 40q4 3 8 0" fill="none" stroke="%s" stroke-width="2.5" stroke-linecap="round"/>' % K +
        star(53, 11, 7.5, C, 4, 0.35) + star(10, 50, 5.5, T, 4, 0.35)),
    "icons/jump-lab": (P,
        '<path d="M17 37Q31 5 47 30" fill="none" stroke="%s" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 6"/>' % C +
        '<rect x="5" y="46" width="24" height="11" rx="3" fill="%s"/>' % T +
        '<rect x="37" y="38" width="23" height="11" rx="3" fill="%s"/>' % T +
        '<rect x="9" y="28" width="15" height="15" rx="4" fill="%s"/>' % O +
        eyes(14, 19.5, 34, 2)),
    "icons/deep-diya": (P,
        '<path d="M32 8Q43 21 32 36Q21 21 32 8Z" fill="%s"/>' % O +
        '<path d="M32 19Q37 27 32 34Q27 27 32 19Z" fill="%s"/>' % Y +
        '<path d="M10 38H54Q52 54 32 54Q12 54 10 38Z" fill="%s"/>' % T +
        '<path d="M17 44h30" stroke="%s" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 6"/>' % P),
    "icons/sankofa": (P,
        '<path d="M32 51C15 40 11 27 18 20C24 14 31 17 32 24C33 17 40 14 46 20C53 27 49 40 32 51Z" fill="none" stroke="%s" stroke-width="5" stroke-linejoin="round"/>' % O +
        '<path d="M32 24C30 30 23 30 23 26C23 23 27 23 27 26M32 24C34 30 41 30 41 26C41 23 37 23 37 26" fill="none" stroke="%s" stroke-width="3.5" stroke-linecap="round"/>' % O +
        '<path d="M32 51V57M24 57.5H40" stroke="%s" stroke-width="4" stroke-linecap="round"/>' % T),
    "icons/last-stand": (P,
        '<path d="M32 8L51 15V30C51 43 43 52 32 57C21 52 13 43 13 30V15Z" fill="%s"/>' % T +
        '<path d="M32 14L45 19V30C45 39 40 46 32 50Z" fill="%s" fill-opacity=".25"/>' % C +
        '<path d="M22 30l10 8 10-8" fill="none" stroke="%s" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' % O),
    "icons/tiny-legends": (P,
        pixels(["#..#..#", "##.#.##", "#######", "#######", "#######"], 11, 17, 6, O) +
        '<rect x="29" y="35" width="6" height="6" fill="%s"/>' % P +
        '<rect x="17" y="35" width="6" height="6" fill="%s"/><rect x="41" y="35" width="6" height="6" fill="%s"/>' % (T, T) +
        pixels(["#.#", ".#."], 26, 4, 4, C) + '<rect x="11" y="50" width="42" height="5" fill="%s"/>' % T),
    "icons/dugout": (P,
        '<rect x="8" y="10" width="48" height="44" rx="6" fill="%s"/>' % T +
        '<path d="M32 10V54" stroke="%s" stroke-width="2" stroke-opacity=".5"/>' % P +
        '<circle cx="32" cy="32" r="7" fill="none" stroke="%s" stroke-width="2" stroke-opacity=".5"/>' % P +
        '<path d="M15 18l6 6M21 18l-6 6M15 40l6 6M21 40l-6 6" stroke="%s" stroke-width="3" stroke-linecap="round"/>' % P +
        '<circle cx="46" cy="21" r="3.8" fill="none" stroke="%s" stroke-width="3"/>' % O +
        '<path d="M23 31Q32 20 41 27" fill="none" stroke="%s" stroke-width="3" stroke-linecap="round"/>' % O +
        '<path d="M37 23l5 4-6 2" fill="none" stroke="%s" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' % O),
    "icons/cue-the-sequence": (P,
        '<circle cx="34" cy="26" r="19" fill="%s"/>' % K +
        '<circle cx="34" cy="26" r="9" fill="%s"/>' % P +
        '<circle cx="34" cy="23" r="2.4" fill="none" stroke="%s" stroke-width="2"/>' % K +
        '<circle cx="34" cy="28.6" r="2.9" fill="none" stroke="%s" stroke-width="2"/>' % K +
        '<path d="M5 60L9 56M2 52L6 50" stroke="%s" stroke-width="3" stroke-linecap="round"/>' % C +
        '<circle cx="16" cy="50" r="6.5" fill="%s" stroke="%s" stroke-width="2.5"/>' % (P, K) +
        '<path d="M22 44L26 39" stroke="%s" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 4"/>' % O),
    "icons/paragraph-dash": (P,
        '<path d="M2 55H62" stroke="%s" stroke-width="4.5"/>' % T +
        '<path d="M35 53L42 41L49 53ZM47 53L54 41L61 53Z" fill="%s"/>' % K +
        '<path d="M5 20h9M2 28h10" stroke="%s" stroke-width="3" stroke-linecap="round"/>' % C +
        '<g transform="rotate(-12 26 25)"><rect x="14" y="13" width="24" height="24" rx="5" fill="%s"/>' % O +
        eyes(21.5, 30.5, 23, 2.6) +
        '<path d="M21 30q5 3 10 0" fill="none" stroke="%s" stroke-width="2.5" stroke-linecap="round"/></g>' % K),
    "icons/chip-run": (P,
        '<path d="M34 13q4-4 8 0q4-4 8 0M11 19q3-3 6 0q3-3 6 0" fill="none" stroke="%s" stroke-width="3" stroke-linecap="round"/>' % K +
        '<rect x="22" y="21" width="15" height="32" rx="5" fill="%s" stroke="%s" stroke-width="2.5" transform="rotate(14 29.5 37)"/>' % (Y, O) +
        eyes(27, 33.5, 33, 2.2) +
        '<path d="M43 49h8M45 43l7-2" stroke="%s" stroke-width="3" stroke-linecap="round"/>' % C +
        '<path d="M2 58.5H62" stroke="%s" stroke-width="5"/>' % T),
    "icons/chess": (P,
        '<path d="M20 51H46V45H43C42 37 44 32 44 26C44 17 37 10 28 10L26 6L22 12C18 15 15 21 14 27C13 31 17 33 20 30C22 28 25 27 27 27C24 32 21 38 21 45H20Z" fill="%s"/>' % T +
        '<circle cx="27" cy="18" r="2.4" fill="%s"/>' % P +
        '<rect x="15" y="50" width="36" height="7" rx="3" fill="%s"/>' % O),
    "icons/boxman": (P,
        '<path d="M14 24L32 16L50 24L32 32Z" fill="#e2b07a"/>'
        '<path d="M14 24L32 32V55L14 47Z" fill="#c98a4b"/>'
        '<path d="M50 24L32 32V55L50 47Z" fill="#b5763a"/>'
        '<path d="M14 24L6 17L24 11L32 16M50 24L58 17L40 11L32 16" fill="none" stroke="#c98a4b" stroke-width="3" stroke-linejoin="round"/>' +
        eyes(20, 27, 37, 2.6) +
        '<path d="M19 44q4 3 8 2" fill="none" stroke="%s" stroke-width="2" stroke-linecap="round"/>' % K),
}


# The site already had its bridge icon (drawn by /data/b5site.js) and keeps
# exactly that design, now as a file. The HQ icons were redrawn on the paper
# tile (29 Oct 2026) so they match the family.
BRIDGE = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fffdf8"/>'
          '<path d="M6 44 Q32 8 58 44" fill="none" stroke="#007291" stroke-width="6" stroke-linecap="round"/>'
          '<path d="M20 28v22M32 22v28M44 28v22" stroke="#7fb8c6" stroke-width="3"/>'
          '<path d="M4 50h56" stroke="#0a2f38" stroke-width="6" stroke-linecap="round"/>'
          '<circle cx="52" cy="14" r="7" fill="#ef7724"/></svg>\n')
HQ_COLOURS = [  # folder, initials, tile, letters (keep in step with /style.css section 18)
    ("egw", "EGW", "#2d2466", "#ffe28a"),
    ("lp", "LP", "#e2557a", "#ffffff"),
    ("lw", "LW", "#9a1d2e", "#ffc247"),
    ("lc", "LC", "#16262a", "#c9f7d8"),
    ("hk", "HK", "#1d3a52", "#ff7a1a"),
    ("jt-hq", "JT", "#1f8a3c", "#ffffff"),
]


ARCHIVO = os.path.join(ROOT, "games", "timeline-tantrum", "fonts", "archivo-latin-900-normal.woff2")


def text_path(text, size, cx, baseline, max_width):
    """Initials as drawn shapes in Archivo Black (the site's heading font),
    so they look the same on every device whatever fonts it has.
    Needs fontTools and brotli (pip install fonttools brotli)."""
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    font = TTFont(ARCHIVO)
    gs, cmap, upm = font.getGlyphSet(), font.getBestCmap(), font["head"].unitsPerEm
    names = [cmap[ord(ch)] for ch in text]
    width = sum(gs[n].width for n in names)
    scale = min(size / upm, max_width / width)
    x = cx - width * scale / 2
    pen = SVGPathPen(gs, ntos=lambda v: ("%.1f" % v).rstrip("0").rstrip("."))
    for n in names:
        gs[n].draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
        x += gs[n].width * scale
    return pen.getCommands()


def hq_icon(who, bg, ink):
    # Paper tile like the rest of the family: the orange bridge arch on top,
    # the HQ's initials in its own colour, and a deck line in that colour.
    d = text_path(who, 39, 32, 50, 52)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fffdf8"/>'
            '<path d="M9 21Q32 1 55 21" fill="none" stroke="#ef7724" stroke-width="5" stroke-linecap="round"/>'
            '<path d="%s" fill="%s"/>'
            '<path d="M13 57H51" stroke="%s" stroke-width="4" stroke-linecap="round"/></svg>\n'
            % (d, bg, bg))


EXISTING = {"icons/base5": BRIDGE}
for folder, who, bg, ink in HQ_COLOURS:
    EXISTING[folder + "/favicon"] = hq_icon(who, bg, ink)


def main():
    out = dict(EXISTING)
    for name, spec in ICONS.items():
        if spec:
            out[name] = svg(*spec)
    for name, text in out.items():
        path = os.path.join(ROOT, name + ".svg")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        text.encode("ascii")
        open(path, "w", encoding="ascii").write(text)
    # back ups for old browsers and home screens: the Base 5 bridge
    import cairosvg
    from PIL import Image
    tile = BRIDGE.encode()
    frames = []
    for size in (16, 32, 48):
        png = cairosvg.svg2png(bytestring=tile, output_width=size, output_height=size)
        frames.append(Image.open(io.BytesIO(png)).convert("RGBA"))
    frames[-1].save(os.path.join(ROOT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)], append_images=frames[:-1])
    full = BRIDGE.replace(' rx="14"', "")
    cairosvg.svg2png(bytestring=full.encode(), output_width=180, output_height=180,
                     write_to=os.path.join(ROOT, "apple-touch-icon.png"))
    print("made %d icons plus favicon.ico and apple-touch-icon.png" % len(out))


if __name__ == "__main__":
    main()
