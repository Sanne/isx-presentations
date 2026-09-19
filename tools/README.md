# tools/

## audit.py — check that no slide overflows

The deck's hard rule is that every slide fits without scrolling or clipping
(see `.claude/agents.md`). You cannot verify that by reading the HTML — it
depends on rendered text metrics. This renders the deck in headless Chromium
and measures every slide.

```bash
.venv/bin/python tools/audit.py              # measure all slides
.venv/bin/python tools/audit.py --shots      # + PNGs in tools/shots/
.venv/bin/python tools/audit.py deck2.html   # a different deck
```

Exit code is 0 when everything fits, 1 when anything overflows — so it works
as a pre-commit check. It starts its own HTTP server on a free port; nothing
needs to be running first.

Output is one row per slide:

```
  6    639/720       89%  Can't we just use Docker?
 42    652/720       91%  Installation
```

`content/limit` is the slide's real content height against the 720px canvas.
**Read the fill percentage, not just the pass/fail.** Consistently low numbers
(40–50% everywhere) mean the type scale is too small for the frame, which is
its own design problem; high 80s–low 90s on the densest slides is the target.

### First-time setup

The venv is gitignored, so a fresh clone or sandbox needs:

```bash
python3 -m venv .venv
.venv/bin/pip install playwright
.venv/bin/playwright install chromium     # note: NOT --with-deps
```

On Fedora, `playwright install --with-deps` **fails** — it doesn't recognise
the distro, falls back to Ubuntu, and shells out to `apt-get`. Install the
browser without that flag and get the libraries from dnf:

```bash
sudo dnf install -y nss nspr atk at-spi2-atk at-spi2-core cups-libs \
    libdrm libxkbcommon libXcomposite libXdamage libXfixes libXrandr \
    libXext libXi mesa-libgbm alsa-lib pango cairo libxshmfence
```

## reveal.js gotchas this deck depends on

Worth knowing before touching layout CSS in `index.html`, because each of
these fails silently:

- **Never put slide layout on `<section>` itself — use the `.slide-inner`
  wrapper.** Reveal writes `display: block` inline on the current slide, so a
  stylesheet rule making the section a flex container needs
  `display: flex !important`, and that must be scoped to `.present` or every
  slide renders at once. Doing that causes a nasty glitch: the outgoing slide
  loses `.present` the instant you navigate, so its padding and centring
  vanish and its title snaps to the top-left corner, where it sits at full
  opacity for the whole 400ms fade-out. Keeping layout on the inner wrapper
  avoids the problem entirely and needs no `!important` — reveal keeps sole
  control of the section's `display`.
- **The usable height is the full 720px canvas**, not canvas minus `margin`.
  Reveal sizes `.slides` to the canvas and folds `margin` into the CSS scale
  factor. Subtracting it reports every slide as overflowing.
- **`.slide-inner`'s min-height pins `scrollHeight` to 720**, hiding the real
  content height. `audit.py` drops it to 0 while measuring. That min-height is
  the canvas height as a `--canvas-h` token; keep it in sync with the `height`
  passed to `Reveal.initialize`.
- **Auto margins beat `flex-grow`.** In the three-zone slide layout, `.note`
  uses `margin-top: auto` to pin to the bottom while `.body` uses `flex: 1`.
  That works only because flex-grow resolves first; if free space remained,
  the auto margin would swallow it and `.body` would never grow.
- **Sizes are in px, deliberately.** The canvas is a fixed 1280×720 that reveal
  scales as one unit, so px are stable design units here. `em` compounds
  through nesting and was the original source of the deck's size drift — don't
  reintroduce it for type sizes.
