#!/usr/bin/env python3
"""Audit a reveal.js deck for slides that overflow the canvas.

The deck's rule is that every slide must fit without scrolling or clipping.
That cannot be checked by reading the HTML: it depends on rendered text
metrics, so this renders the real deck in headless Chromium and measures
each slide.

    python3 tools/audit.py                 # measure every slide
    python3 tools/audit.py --shots         # also write PNGs to tools/shots/
    python3 tools/audit.py --shots -o /tmp/x   # ...somewhere else
    python3 tools/audit.py deck2.html      # audit a different file

Exits 0 when every slide fits, 1 when any slide overflows or scrolls
sideways, so it doubles as a pre-commit check.

Setup (one time, and again in any fresh sandbox — the venv is gitignored):

    python3 -m venv .venv
    .venv/bin/pip install playwright
    .venv/bin/playwright install chromium     # NOT --with-deps on Fedora

Then run it with `.venv/bin/python tools/audit.py`.

On Fedora, `playwright install --with-deps` fails: it detects an unknown
distro, falls back to Ubuntu, and shells out to apt-get. Install the
browser without --with-deps and get the shared libraries from dnf instead:

    sudo dnf install -y nss nspr atk at-spi2-atk at-spi2-core cups-libs \
        libdrm libxkbcommon libXcomposite libXdamage libXfixes libXrandr \
        libXext libXi mesa-libgbm alsa-lib pango cairo libxshmfence

== Measuring a reveal.js slide correctly ==

Three things make naive measurements wrong, all learned the hard way:

1. The usable height is the FULL configured canvas height (720), not
   height minus margin. Reveal sizes `.slides` to the canvas and absorbs
   `margin` into the CSS scale factor, so subtracting it reports every
   slide as overflowing by the margin.

2. Each slide's `.slide-inner` wrapper sets a min-height of the full
   canvas, which pins scrollHeight to exactly that and hides the real
   content height. This drops min-height to 0 to measure, then restores
   it. (The layout lives on that wrapper rather than on <section> so
   reveal keeps sole control of the section's `display` -- see
   tools/README.md.)

3. Fragments are invisible until stepped through, so an un-revealed slide
   measures short. This force-adds `.visible` to every fragment first,
   which is also why a slide can measure taller than it ever looks while
   presenting -- that is intended, the last fragment must still fit.
"""

import argparse
import functools
import http.server
import pathlib
import socketserver
import sys
import threading

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("playwright not installed -- see the setup notes at the top of this file")

REPO = pathlib.Path(__file__).resolve().parent.parent

# Runs in the page against the currently-displayed slide.
MEASURE = """
() => {
  const cfg = Reveal.getConfig();
  // Usable box is the whole canvas; reveal's margin lives in the scale factor.
  const limitH = cfg.height, limitW = cfg.width;
  const s = Reveal.getCurrentSlide();

  // A slide must fit with every fragment revealed, so show them all.
  s.querySelectorAll('.fragment').forEach(f =>
    f.classList.add('visible', 'current-fragment'));

  // The .slide-inner wrapper's min-height pins it to the full canvas and
  // would mask the true content height, so drop it while measuring.
  const box = s.querySelector('.slide-inner') || s;
  const prevMin = box.style.minHeight;
  box.style.minHeight = '0px';
  const contentH = box.scrollHeight;
  box.style.minHeight = prevMin;

  const title = (s.querySelector('h1,h2') || {}).textContent || '(untitled)';
  return {
    title: title.trim().replace(/\\s+/g, ' ').slice(0, 52),
    h: contentH,
    limitH: Math.round(limitH),
    limitW: Math.round(limitW),
    // Any descendant whose content is wider than its box. Elements inside
    // an <svg> are skipped: a viewBox scales its contents to fit, so they
    // cannot scroll, and their scrollWidth/clientWidth differ by a pixel
    // or two for reasons that mean nothing. The <svg> itself is still
    // checked, since that is a normal CSS box.
    wide: [...s.querySelectorAll('*')]
      .filter(e => !e.parentElement.closest('svg'))
      .filter(e => e.scrollWidth > e.clientWidth + 1)
      .map(e => `${e.tagName}.${e.getAttribute('class') || '-'} ${e.scrollWidth}>${e.clientWidth}`)
      .slice(0, 3),
  };
}
"""


def serve(directory):
    """Start a background HTTP server on a free port; return its base URL."""

    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        # log_message belongs on the handler, not the server, or every
        # request prints over the audit table.
        def log_message(self, *a):
            pass

    handler = functools.partial(QuietHandler, directory=str(directory))

    class Server(socketserver.ThreadingTCPServer):
        allow_reuse_address = True
        daemon_threads = True

    httpd = Server(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{httpd.server_address[1]}", httpd


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("deck", nargs="?", default="index.html",
                    help="deck to audit, relative to the repo root (default: index.html)")
    ap.add_argument("--shots", action="store_true", help="write a PNG per slide")
    ap.add_argument("-o", "--out", default=str(REPO / "tools" / "shots"),
                    help="screenshot directory (default: tools/shots/)")
    args = ap.parse_args()

    if not (REPO / args.deck).is_file():
        sys.exit(f"no such deck: {REPO / args.deck}")

    outdir = pathlib.Path(args.out)
    if args.shots:
        outdir.mkdir(parents=True, exist_ok=True)

    base, httpd = serve(REPO)
    problems, rows, errors = 0, [], []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        # 2x scale so screenshots are legible when read back.
        page = browser.new_page(viewport={"width": 1600, "height": 900},
                                device_scale_factor=2)
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        page.on("console",
                lambda m: errors.append(f"console.error: {m.text}")
                if m.type == "error" else None)

        page.goto(f"{base}/{args.deck}", wait_until="networkidle")
        page.wait_for_function("() => window.Reveal && Reveal.isReady()")
        page.wait_for_timeout(1200)  # let webfonts land; they change metrics

        for i in range(page.evaluate("() => Reveal.getTotalSlides()")):
            page.evaluate(f"() => Reveal.slide({i})")
            page.wait_for_timeout(700)   # outlast the slide transition, or
                                         # the previous slide ghosts into the shot
            row = page.evaluate(MEASURE)
            row["n"] = i + 1
            rows.append(row)
            if args.shots:
                page.wait_for_timeout(300)  # fragment opacity transitions
                page.screenshot(path=str(outdir / f"slide-{i + 1:02d}.png"))

        browser.close()
    httpd.shutdown()

    print(f"{'#':>3}  {'content/limit':>13}  {'fill':>5}  title")
    for r in rows:
        over, flag = r["h"] - r["limitH"], ""
        if over > 1:
            flag, problems = f"  <-- OVERFLOWS by {over}px", problems + 1
        elif r["wide"]:
            flag, problems = f"  <-- SCROLLS SIDEWAYS {r['wide']}", problems + 1
        pct = round(100 * r["h"] / r["limitH"])
        print(f"{r['n']:>3}  {r['h']:>5}/{r['limitH']:<7} {pct:>4}%  {r['title']}{flag}")

    print(f"\n{len(rows)} slides, {problems} problem(s).")
    if args.shots:
        print(f"screenshots: {outdir}")
    if errors:
        print("\nPage errors:")
        for e in dict.fromkeys(errors):
            print("  ", e)

    return 1 if problems or errors else 0


if __name__ == "__main__":
    sys.exit(main())
