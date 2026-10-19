"""Box geometry, measured from the Hooked / Jump Lab renders (2x canvas 1280x1644)."""
import numpy as np
from PIL import Image

W2, H2 = 1280, 1644  # 2x output

# front face corners TL, TR, BR, BL (2x px)
FRONT = [(234.5, 17.6), (1098.86, 135.92), (1114.29, 1510.94), (240.06, 1631.76)]
# spine corners TL, TR, BR, BL (2x px); right edge meets the front
SPINE = [(193.7, 53.8), (234.5, 17.6), (240.06, 1631.76), (202.5, 1599.0)]

FRONT_TEX = (1520, 2120)   # flat front texture px (760x1060 css at 2x)
SPINE_TEX = (220, 2120)    # flat spine texture px (110x1060 css at 2x)


def coeffs(dst, src):
    """PIL PERSPECTIVE coeffs mapping output(dst) points -> input(src) points."""
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


def rect(w, h):
    return [(0, 0), (w, 0), (w, h), (0, h)]


def warp_onto(tex, quad, out_size, scale):
    """Warp an RGBA texture into quad (2x coords) on a canvas of out_size, scale = out/2x."""
    q = [(x * scale, y * scale) for x, y in quad]
    c = coeffs(q, rect(*tex.size))
    return tex.transform(out_size, Image.PERSPECTIVE, c, Image.BICUBIC)


def unwarp(img2x, quad, size):
    """Pull a flat texture of `size` out of a 2x render."""
    c = coeffs(rect(*size), quad)
    return img2x.transform(size, Image.PERSPECTIVE, c, Image.BICUBIC)
