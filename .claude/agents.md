# isx-presentations

Reveal.js presentations about [isx](https://isx.run) (incus-spawn) — a CLI tool for managing isolated Incus-based development environments for AI coding agents.

## Project structure

- `index.html` — self-contained reveal.js presentation, loads reveal.js from CDN. No build step; open in a browser to present.
- Preview with `python3 -m http.server 8080` and open `http://localhost:8080`.
- `tools/audit.py` — renders the deck headless and measures every slide for overflow. **Run it after any slide or CSS change**; see `tools/README.md` for setup and for the reveal.js layout gotchas that fail silently.

## Styling rules

- **Type sizes are px, set from the tokens in `:root`** — never `em`, and never an inline `font-size` on a slide. The canvas is a fixed 1280×720 that reveal scales as a unit, so px are stable. `em` compounds through nesting, which is what made sizes drift in the first place.
- Every slide's content lives inside a `<div class="slide-inner">` wrapper, which carries the padding and layout. Never move that onto `<section>` — see `tools/README.md` for the transition glitch that causes.
- Within it, a content slide is three zones: `<h2>` anchored at the top, `<div class="body">` between, and a trailing `<p class="note">` pinned to the bottom.
- Reuse the existing roles (`.lead`, `.note`, `.cards`/`.card`, `.diagram`, `.tree`, `.kw`) rather than adding one-off styles.
- **Boxes hug their content and never stretch.** A card with two lines in it is two lines tall; the accent is a rule across the *top*, not a left bar. Vertical balance comes from the optical centring on `.body` — don't stretch boxes to fill height, which just floats text in an empty frame.
- **Images are embedded as data URIs**, never hotlinked, so the deck cannot show broken images mid-talk and does not depend on third-party asset URLs staying put.
- **Code blocks use flat syntax colouring** — one colour for every token, with only comments muted. No highlighter theme: a grammar picks out whatever it calls a keyword, which in bash lit up `enable` and `history` purely for being shell builtins and drew the eye to the wrong word. highlight.js still runs, but only to find comments.

## Presentation style preferences

- **Theme**: Tron-inspired — near-black blue ground (#070b14), electric cyan accents with restrained glow on edges and rules. Bold and electrical, but slick, never neon mush: glow goes on borders and rules, never on body text.
- **Colour is semantic, never decorative.** Exactly three chromatic roles: `--accent` cyan (isx, and anything affirmative), `--warn` amber (partial or conditional, e.g. "Limited", OAuth), `--danger` red (a genuine threat). Slide titles highlight in cyan; only the opening problem slides highlight in red. If a colour is not carrying one of those meanings, it does not appear — no per-card or per-row colour variety.
- **Font weight**: Semibold (600) for headings, not heavy/black. Keep it refined and readable.
- **Content density**: Every slide must fit without scrollbars or clipping on a standard screen. When a slide overflows, reduce content or split — never rely on scrolling.
- **Tone**: Technical team demo — practical, not salesy. Show real commands and YAML, not abstract promises.
- **Diagrams over prose**: Prefer visual flow diagrams, tables, and feature-card grids over long paragraphs.
- **Code examples**: Use real isx commands and YAML. Quote arguments that contain special shell characters like `?`.
- **Taint is unconditional**: a branch is tainted the moment an agent runs in it — not because it did anything wrong and not after some threshold of use. The reason is epistemic: you can't prove what it changed. Never phrase it as conditional ("a long experiment may leave it compromised" is wrong).
- **Accuracy**: Don't overstate security claims — say "we don't give credentials to the container" rather than "it's impossible to obtain them." Don't call agents "trusted" — all agent-generated code is untrusted.
- **Consistency**: Use `isx ask` (not `isx help`) for the AI help command. Refer to the website as `isx.run`.
- **Priorities**: Credential isolation (the MITM proxy) and CoW branching + storage sharing are the two pillars — don't bill either as "the standout feature"; the others are just as interesting. Caching is "prudent" — only verified/signed/immutable artifacts are cached.
- **macOS**: Always mention macOS support with the custom lightweight Linux appliance — it's important for team adoption.
- **Agent-agnostic**: isx works with Claude, Pi, Bob, Codex, and any HTTPS-based agent. Don't frame it as Claude-only.
- **Local-first**: A core conviction, not a limitation. Your hardware, your network, your repos.
