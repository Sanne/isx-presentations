# isx deck — storyboard

The deck makes the case for isx by walking a developer's path in small steps:
**a practical situation → the limitation it hits → the wish → how isx is designed
for it → what that looks like to use.** Every step earns the next one.

The yardstick, set up on the first slides and reused throughout:

> Can I **leave it alone**? Can I run **five at once**? Can I **trust its work**?

Status tags used below: **shipped** (in isx today), **roadmap** (open issue — must be
labelled as such on the slide), **verify** (claim needs checking before it goes on a slide).
Animation tags: **[native]** Vue/SVG stepped by clicks, **[clip]** Motion Canvas, **[demo]** live terminal.

---

## How the story is told

**Show the pain before naming it.** Each act opens with a scene the audience has lived, played
click by click on a mock agent terminal (`components/Term.vue`, scenes in `scenes/index.ts`) or a
timeline. The slide never announces "the real danger is…"; the audience works it out, then a
one-line punchline names the feeling. Data (Anthropic's 93% approval stat, the classifier's miss
rates) only backs a punchline, in a footnote or the speaker notes. Where possible, isx's answer
**replays the same scene** on an isx machine (the OpenJDK task, the `env | grep TOKEN` look).
Slide text stays short; the narration lives in the speaker notes.

The acts are the days of one week with coding agents:

| Act | Day | Scenes |
|---|---|---|
| 0 | — | title → the promise, with the three questions under it (one slide) |
| 1 | Monday: one agent, on my laptop | fix one failing test (approval counter) → "you became the approve button" → the coffee break (the prompt waited 29 minutes) → five agents (the human is the bottleneck) → Homer: the stick, the drinking bird, the meltdown (three original frames from "King-Size Homer", fetched by `tools/fetch-memes.sh`, not committed; an original drawing is the fallback) → **your turn: yes or no?** (the audience game: a command every couple of seconds, from `mvn -q test` to `sudo dd`, the room shouts, Y/N records its verdict, the drinking bird approves every one; starts on a click so the game can be explained first, and freezes on the next click to reveal what Homer came back to) → the allowlist you wrote one tired click at a time (the drinking bird, in Claude Code's terms): what it asked, why you said yes, the prefix rule it saved, then read back as what each rule really permits → "and tomorrow?" (rules are saved per repository: new project, new prompts) → "too broad to be safe, too narrow to leave it alone" → auto mode → the patched-OpenJDK task in the sandbox (configure fails one missing library at a time, 10:00–10:36, six approvals; `make images` measured at ~15 min) → "you wouldn't hand a new hire your laptop; you'd set them up with a machine of their own" → **meet the isx machine** (diagram: your laptop, your things, agentuser with passwordless sudo, what it can't reach) → the same task on isx → where did your 30 minutes go (animated: with prompts the agent stalls and you end up fried; on isx both run smoothly) → why a system container (three cards: Docker, a VM, an isx machine; the two comparison tables are backup slides) → tick, with its three reasons |
| 2 | Wednesday: five agents at once | worktrees (diagram: one .git, three checkouts, one shared machine) → **two agents, one localhost** (B's integration tests quietly run against A's database, then its teardown empties it) → **Thursday afternoon**: the shared SNAPSHOT poisons B's evidence and it commits a wrong fix → "a worktree isolates your checkout, not the machine it runs on" → isx branching → every branch is a whole machine (same diagram, the shared machine moved inside each box) → CoW → set up once, every branch starts ready → branch a live reproducer → YAML → tick, with reasons |
| 3 | Friday: code from strangers | "reproducer attached" → what that build can see (`env`) → the same look from isx → how: the proxy → network modes → principles (Saltzer & Schroeder, OWASP LLM06, the lethal trifecta) → identity (its own account; a principal, not a process) → you still review its work → why not a shared mount (the review/build race) → what comes back: a commit → getting it back is just git (`isx branch` adds the remote, `git fetch`, `isx destroy` removes it) → "trust it like a PR from a new colleague" → tick, with reasons |
| 4 | Under the hood | architecture on Linux → what `isx branch` does → under `git fetch agent-1` (the remote helper) → architecture on macOS (the appliance VM, vsock, the proxy on the Mac, the recovery agent) → caching (embargoed until #555) → every request passes one point: live account swap (shipped) and the roadmap (#322) → demo → **others are building the same boundary** (Claude Code's sandbox, Docker Sandboxes, cloud sessions; where isx differs) → local-first → get started → built on → close → backup: the Docker and VM tables |

`slides.md` is the source of truth for the exact order; the sections below keep the reasoning,
the planned animations and the claims register. **The animations still to build are specified in
`ANIMATIONS.md`**, written as a hand-over.

## Act 0 — The goal (2–3 slides)

1. **Title.** isx — safe machines for AI agents.
2. **The promise of agentic coding** is not a faster autocomplete; it's *dispatch several
   tasks, walk away, come back to finished work*. Hand the agent a terminal and it can do real work.
3. **The yardstick** — the three questions above, shown as three empty checkboxes that
   get ticked as the talk progresses (reused as a small progress motif on section dividers).

## Act 1 — "Let it run on my laptop"

### 1.1 Permission prompts
- Situation: the default agent asks before each command.
- Limitation: approval fatigue — Anthropic's own measurement is that **users approve 93% of
  permission prompts**, i.e. the prompt stops being a decision. Worse than annoyance: the agent
  **can't finish without you**, so you can't walk away, and running several agents in parallel
  turns into extreme multitasking.
- **[native]** Five agent lanes running side by side; prompts pop up at random in each lane and
  stall it until "you" (a single attention cursor) get there. A utilisation bar shows the human
  as the bottleneck. Same lanes reappear in Act 2 with isx, finishing on their own.

### 1.2 Auto mode (be precise and fair here)
How it actually works (sources below):
- A **second model (the classifier, Sonnet 5 by default)** reviews each action before it runs.
  Reads and edits inside the working directory skip it; shell commands, network calls and
  writes outside the project go to it.
- Two stages: a fast single-token yes/no filter, then chain-of-thought only if flagged.
- It sees user messages and the agent's tool calls, **not** tool outputs (a prompt-injection defence).
- Cost: on API / Enterprise / cloud-provider accounts **classifier calls count toward token
  usage** and add a round-trip before each checked action.
- It falls back to prompting after **3 blocks in a row or 20 in a session**; in non-interactive
  runs the blocked action is simply skipped.
- Anthropic's published error rates: **0.4% false positives** on real traffic, **17% false
  negatives on real overeager actions**, **5.7% on synthetic exfiltration**.
- Anthropic's own framing: *"a per-action control, not an isolation boundary"*; they continue to
  recommend isolated environments.

Our point, stated fairly: auto mode is a real improvement for interactive work, but the guard
is **another instance of the same vendor's model family**. The default classifier is Sonnet 5, and
when the session itself runs Sonnet 5 it is literally the same model judging its own actions. Its
behaviour is non-deterministic, it has a published miss rate, and it hands control back to you
when unsure. For unattended, parallel work we want a **boundary we can reason about**, not a
better guess.
- **[native]** An action stream flowing through a classifier gate: most pass, some are stopped,
  a small fraction of risky ones slip through (sized to the published 17%), and after three
  blocks the lane stalls back to a human prompt.

### 1.3 Process sandboxes — and the code the agent runs
Be accurate: Claude Code's sandboxed Bash **does** confine child processes, so the tests the
agent runs *are* sandboxed. The gaps are elsewhere, and all are documented by Anthropic:
- By default it **reads the entire computer**, including `~/.ssh` and `~/.aws/credentials`,
  unless you list them.
- Sandboxed commands **inherit your environment variables**, credentials included, unless
  configured otherwise. *"There is no built-in credential deny list."*
- The network starts with **no domains allowed**: each new host is a prompt.
- File tools, MCP servers and hooks run **outside** the sandbox.
- An **escape hatch** retries a failing command unsandboxed (via the permission flow).
- Their own verdict: *"not a complete isolation boundary"* and *"not sufficient for fully
  unattended runs"*.

**"What if it downloads a tool, installs it and talks to it?"** Per the docs:
- A program launched from a sandboxed command inherits the sandbox, so a binary the agent
  downloads and runs from its project directory *is* confined.
- The download needs its host allowed: a prompt, or a classifier check in auto mode.
- Installing it system-wide (`sudo dnf`, `/usr/local`) writes outside the allowed paths, so it
  can't run sandboxed. It goes through the unsandboxed escape hatch, and if you approve that, the
  installer (and its package scriptlets, as root) run **unsandboxed**.
- Anything that hands work to a process *outside* the sandbox escapes it. The documented example:
  *"`docker` is incompatible with the sandbox. Add `docker *` to `excludedCommands`"*, so
  Testcontainers and compose run unsandboxed, and Anthropic warns that allowing the Docker socket
  *"effectively grants access to the host system"*. Also: systemd services started via sudo, and
  macOS apps via Apple Events if enabled.
- verify: whether a sandboxed command can connect to a server on localhost isn't covered on the
  docs page; test it before saying anything.
- The sandbox guards the agent's *commands*, not what happens to its *output* later. Code it wrote
  gets run on your host by your IDE, your build and your test runner, all unsandboxed. (The old
  deck's line: "anything it writes, your IDE and build tools will happily execute.") On isx the IDE
  backend runs inside the agent's machine too (Gateway / VS Code Remote).

The critical visual: **the agent's job is to write code and then run it.** Whatever that code
can reach, the agent can reach.
- **[native]** The write → run → observe loop, drawn as a circle *inside* your laptop, with
  everything else on the machine (home directory, keys, env, other repos) sitting just outside a
  dotted, porous line. Click by click, show what the running code can read.

**Worked example — "I wish I had a patched OpenJDK"**, told as a counter of interruptions:
clone the OpenJDK sources (new host → prompt), `dnf builddep` (needs sudo → can't run
sandboxed → unsandboxed prompt), fetch a boot JDK (another host), autoconf/configure, build,
run the patched JDK against the project. Then the same task on an isx machine: the agent is
root on its own box, installs what it needs, and you look at the result.
- **[native]** Split screen: left, a prompt counter ticking up on each step; right, the same
  steps completing with the counter at zero.
- verify: walk the real OpenJDK build steps once and count the actual prompts, so the number
  on the slide is measured, not estimated.

### 1.4 The wish → a machine of its own
- Hero statement, kept from the old deck: *You wouldn't hand a new hire your laptop — not even a
  clone of it.*
- isx gives each agent **a complete Linux machine**: its own init, network, process tree,
  passwordless sudo — and **nothing of yours inside**. Total freedom in the box, nothing of value
  to steal (reuse the "Total freedom inside the sandbox" slide).
- **Why not Docker?** Condensed and corrected (see claims register): application containers vs
  system containers. Keep the rows that are true: no init system by default, nested containers
  need `--privileged`, `perf` blocked by the default seccomp profile. Drop "no ping / no strace"
  — both work on current Docker. Acknowledge Podman does run systemd.
- **Or a VM?** Keep the honest table. `--type vm` is one flag away; recommend it for actively
  malicious code.

## Act 2 — "Now run five of them"

### 2.1 Git worktrees, for those who haven't used them
- One repository, several checked-out branches in separate directories that share one `.git`.
  Perfect for letting several agents edit code in parallel.
- **[native]** One `.git` object store in the middle, three working directories fanning out, each
  on its own branch; a commit in one shows up as a ref for the others.

### 2.2 Where worktrees stop
A worktree isolates **files in the repo**. Everything else on the machine is still shared:
- **Ports and dev services.** Two branches both start a server on 8080, or both run
  Testcontainers / compose stacks.
- **Installed tools and versions.** One agent installs a different JDK or CLI version.
- **The sneaky one: shared local artifacts.** Agent A runs `mvn install` on a patched
  `lib-1.2-SNAPSHOT` into `~/.m2`; agent B's build silently picks it up. If B's tests fail
  consistently you're lucky; if B is reproducing an intermittent timing issue, it sees
  behaviour change some of the time, for no reason it can find.
- **"Works on my machine" drift.** Leftover snapshots and experiments on your laptop lead the
  agent to solutions that only work there.
- **[native]** The SNAPSHOT story as a sequence: two worktree lanes, one shared `~/.m2` box
  underneath; A writes into it (orange), B reads from it, and B's test result flips.

### 2.3 isx branches: worktrees for the whole machine
- Hero, kept from the old deck: *isx **branching** for the entire machine.*
- Each branch is a full copy of the template: its own filesystem, `~/.m2`, services, ports and
  **its own IP**. Branches start from a clean template, and you **destroy rather than clean up**.
- **[native]** The five lanes from 1.1 again, now each its own machine: they run without prompts
  and hand back commits.

### 2.4 Why a branch is cheap and fast — copy-on-write
- **[clip]** The existing CoW animation (template blocks stored once, branches as references,
  only written blocks cost space, destroy frees only the delta).
- Punchline, kept: *Git shares objects between branches. isx shares blocks between machines —
  the same trick, one layer down.*

### 2.5 Front-load the work into the template
- The template build pre-clones the repositories, installs the tools, and **primes** builds
  (e.g. `mvnd … -Dquickly`) so the dependencies are already downloaded.
- That maximises what's shared and minimises time to the agent's first useful action.
- **[native]** A build pipeline filling the template layer by layer: base OS → tools → cloned
  repos → primed dependencies. Then a branch pops out instantly, with a "time to first test" timer.

### 2.6 Branch a live machine: fork experiments
- After an expensive setup (a large dataset, a seeded database), branch the *running* instance
  twice and explore approaches A and B **at the same time**, from the same state. You don't
  repeat the setup, and you save space.
- **[clip]** or **[demo]**: the demo script already stages this as the Postgres fork (`workbench`
  → `exp-a` / `exp-b`); a tree animation of template → prepared instance → two experiments.

### 2.7 Environments as code you can share
- Templates are YAML with inheritance; tools compose. The clean environment is a file you
  review and share (a team templates repo, a project-local `.incus-spawn/`).
- The YAML slide with stepped line highlighting, including the AI-specific fields: `skills`
  (baked into the template) and `agent_note` (added to the agent's `CLAUDE.md`).

## Act 3 — "What it runs, and what it can reach"

### 3.1 The reproducer from the internet
- You eyeball a bug reproducer before running it. Did you also audit its **dependencies** —
  binary JARs, Maven plugins that run at build time, npm `postinstall` scripts?
- A process sandbox doesn't help here: *you* approved the run. On isx it runs on a throwaway
  branch, optionally `--proxy-only` or `--airgap`, with nothing of value on it.
- Honest limit: containers share the host kernel; for actively malicious code, use `--type vm`.
  (Anthropic's own guidance for untrusted repos is a dedicated VM.)
- **[native]** Network modes as three panels with the same packets: full, proxy-only (everything
  except the proxy dropped), airgap (no network device).

### 3.2 Secrets
- To clone and push, call `gh`, and use the model API, the agent normally needs tokens in env
  vars or config files — on the same machine where it runs code it just generated.
- It isn't only the model: every dependency, build plugin and script it runs sees the same
  environment. The only way to be sure none of them takes your tokens: **don't put them there.**
  And it doesn't need to see them: least privilege.

### 3.3 The credential proxy
- **[native]** The existing ProxyFlow slide, extended: the HTTP request is shown as a message
  (headers visible), `x-api-key: sk-ant-placeholder` leaves the container, DNS + redirect route it
  to the host, TLS is terminated, and the header line visibly rewrites to the real key before
  going upstream. A second pass for `git push` with a GitHub token.
- Honest context slide: *the idea is being adopted elsewhere.* Claude Code's sandbox now has an
  opt-in credential **mask** mode, where a local proxy swaps a placeholder for the real value, and
  Anthropic's cloud sessions hold the GitHub token in a proxy outside the VM. Treat that as
  validation. isx's difference: it is **on by default, for every tool and every agent**, and the
  proxy lives **outside the machine the agent controls** (the agent process itself holds no key),
  on hardware you own.

### 3.4 Identity: the agent acts as itself
- Handy: the agent can read issues on your private repositories. Not OK: it signing off actions
  as you.
- **shipped:** per-instance accounts. The agent authenticates as its own bot account (demo:
  `gh api user` prints the bot's login), commits are authored by that account, and what it can
  do is whatever you grant the bot. Externally visible actions go through your review.
- **roadmap (#271):** commit signing with a key that never leaves the host.
- Kept line: *Agents are principals, not processes.*

## Act 4 — Everything passes one point: the dividends

### 4.1 Caching, safely
- The problem: every branch and every build downloads the same dependencies.
- The protocol (must match the code, see the claims register):
  - `maven-metadata.xml` and `-SNAPSHOT` paths **always go upstream**: they're mutable.
  - Release artifacts are cached, and after #555 each one is checked against upstream's checksum
    before it's stored. Reusing your host `~/.m2` already requires its SHA-1 to **match upstream's `.sha1`**.
  - OCI layers are keyed and verified by their SHA-256 digest; npm tarballs by the registry's shasum.
- Number, from `docs/PERFORMANCE-NOTES.md`: a 642 KB artifact served in **~2.8 ms from cache vs
  ~177 ms** from Maven Central, on 2 proxy cores.
- **[native]** Two requests racing: metadata passes straight through to Central every time; an
  artifact request checks the cache, then (for `~/.m2`) compares checksums, green → served
  locally, red → fetched fresh. A small latency bar chart for the 2.8 vs 177 ms.

### 4.2 Swap accounts live — shipped
- `isx account set review-1 claude=personal`: the next request uses the new account, and nothing
  inside restarts. The agent can't tell. (Exception: switching between Claude auth modes.)

### 4.3 Observability and model routing — roadmap (#322)
- The proxy sees every API call, so status, spend, audit and routing to a different model per
  machine need no instrumentation inside the machine, and the agent can't tell.
- The slide must be clearly labelled as direction, not a feature.

## Act 5 — Close

- **[demo]** The loop from the demo script: `isx branch` (seconds) → no secrets inside, yet
  everything authenticates → the agent fixes and commits alone → `git fetch fix-bug`, review the
  diff, cherry-pick → `isx destroy`.
- Tick the three yardstick boxes.
- Local-first, by conviction. Install (one slide).
- **Built on great open source**: Incus, Quarkus, GraalVM, Java, Tamboui & Aesh, with links. A
  thank-you to the communities isx stands on.
- Closing line: *Their machines. Your machine.*

Backup / appendix (out of the main flow): TUI, zmx sessions, IDE integration, `isx doctor`,
`isx ask`.

---

## Kept from the current deck
"You're about to hand an AI agent a terminal"; "'My agent did it' is not a defense";
"You wouldn't hand a new hire your laptop"; "Total freedom inside the sandbox / nothing of value
to steal"; the "branching for the entire machine" hero; "Git shares objects… one layer down";
"Agents are principals, not processes"; the immutable-commit review model; "Local-first, by
conviction"; "Their machines. Your machine."

## Claims register

| # | Claim | Status | Action |
|---|---|---|---|
| 1 | Maven cache "only properly signed releases" (old deck) / "served only if it matches signatures" (plan) / README: every artifact "verified against its content digest or upstream checksum before being committed" | **Wrong for Maven today.** `MitmProxy.fetchCacheAndServe` caches release artifacts from upstream *unconditionally* (code comment: "immutable Maven artifacts"). Only reuse of the host `~/.m2` is SHA-1-checked against upstream. No PGP (`.asc`) verification anywhere. Metadata/SNAPSHOT pass-through is correct. | Fix in progress: [#555](https://github.com/Sanne/incus-spawn/issues/555) (verify on store, self-heal via fresh checksum sidecars). Build the animation on the post-#555 behaviour, and don't present it until #555 ships. Say "checksum", not "signature". |
| 2 | Docker: no ping, no strace, "no real networking" | **Wrong.** Docker sets `ping_group_range` by default (since 2020), and allows ptrace on kernel ≥ 4.8 (since Docker 19.03). | **Fixed** in `index.html`: table rewritten, and the Docker column uses `warn` (conditional) instead of `danger`. isx's own `DESIGN.md` ("Why not Docker?") makes the same ping/strace claim; worth correcting there too. |
| 3 | Proxy "control plane": activity, spend, audit, policy, model routing | **Roadmap** (#322 open). | Label clearly as direction. |
| 4 | Commit signing / "own signing key" | **Roadmap** (#271 open). Per-instance bot accounts are shipped. | Show the bot identity as shipped, signing as roadmap. |
| 5 | Credential swapping as unique to isx | **Not unique.** Claude Code sandbox `mask` mode and cloud-session git proxy exist. | Frame as "on by default, any agent, proxy outside the agent's machine, local". |
| 6 | "There is no audit trail" (old deck) | Overstated: git history and provider logs exist. | Rephrase: you can't tell *who* acted, the agent or you. |
| 7 | OpenJDK example timings and prompt count | `make images` measured at ~15 min with dependencies in place (2026-09-25). Clone/configure/test durations and the prompt count are still estimates. | Run it once under Claude Code's sandbox and count. |
| 8 | VM "~10% overhead" (DESIGN.md) | Unmeasured here. | Don't quote without a benchmark. |
| 9 | Landscape completeness | Docker Sandboxes (microVM per agent) and Anthropic cloud sessions (VM + credential proxy) are real alternatives. | **Done**: "Others are building the same boundary", before "Local-first". Docker Sandboxes also injects credentials through a host-side proxy (docs.docker.com/ai/sandboxes/security), so the proxy is validation, not a differentiator; whole-machine CoW branching, templates and the git remote are. |

## Sources
- Claude Code sandboxing: https://code.claude.com/docs/en/sandboxing
- Choosing a sandbox environment: https://code.claude.com/docs/en/sandbox-environments
- Permission modes / auto mode: https://code.claude.com/docs/en/permission-modes
- How auto mode was built (error rates, 93% approval stat): https://www.anthropic.com/engineering/claude-code-auto-mode
- Docker ptrace / strace: https://jvns.ca/blog/2020/04/29/why-strace-doesnt-work-in-docker/ , https://github.com/containerd/containerd/issues/6802
- Ping without NET_RAW: https://www.antitree.com/2019/01/containers-using-ping-without-cap_net_raw/
- isx: `DESIGN.md`, `docs/VISION.md`, `docs/PERFORMANCE-NOTES.md`, `README.md` (Caching, Accounts), `proxy/…/MitmProxy.java` (`isMavenCacheable`, `fetchCacheAndServe`, `tryM2FallbackThenFetch`)
