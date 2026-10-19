# Box art maker

Every game in the vault has box art drawn at the same size, angle and
layout, so the shelves match. This folder holds the maker used to draw
them. It is not part of the site; nothing links to it.

## What a box has

* A dark box in the game's own colours, with a coloured stripe down the
  front edge of the spine
* Header: bridge mark, BASE 5 GAMES, a yellow rule and a small chip
  (PIXEL, ARCADE, MANAGER...)
* The title in the game's own font, a pixel subtitle
* A real gameplay screenshot in a yellow frame
* A starburst with one big number, and a tilted ribbon of three words
* A pixel tagline, one plain sentence, and a players box
* The spine: bridge mark, title and subtitle reading top to bottom

Output: `box.webp` (640x822) and `box@2x.webp` (1280x1644) with a
transparent background, in `/games/art/<id>/`. Then add
`art:"/games/art/<id>/box.webp"` to the game in `/data/games.js`.

## Making a new one

Needs Python 3 with Pillow, numpy and Playwright (Chromium).

1. Make a working folder with three folders in it: `tools/` (copy this
   folder's files in), `shots/` and `fonts/`.
2. In `fonts/`: `npm i @fontsource/silkscreen @fontsource/archivo
   @fontsource/atkinson-hyperlegible @fontsource/alfa-slab-one`
3. Put a gameplay screenshot in `shots/<id>.png` (about 16:10, no menus,
   no site buttons).
4. Copy an entry in `covers.js`, give it the game's id and change the
   colours and words.
5. Serve the working folder: `python3 -m http.server 8790`
6. `cd tools && python3 render.py ../out <id>` and copy
   `../out/<id>/box*.webp` into `/games/art/<id>/`.

`geom.py` holds the box corners, measured from the HOOKED! render, so
every new box lands in exactly the same place.
