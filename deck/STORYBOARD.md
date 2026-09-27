# isx deck — storyboard

## The spine (rewritten 2026-09-27; the earlier deck is at tag `deck-v1-three-questions`)

Not a feature tour and not a checklist: a week with an agent, in which each
problem you hit is answered by one choice, and the six choices add up to isx.
A **blueprint** of your laptop (`Blueprint.vue`) is built up over the talk;
each day ends with it lit one stage further, beside a ledger that says
*problem → choice*. The last line of Friday completes the picture and the slide
retitles itself "This is isx." Nothing appears at the end that the room didn't
watch arrive; the reasons stay attached to the parts.

| # | Day | The problem you hit | The choice | What it is in isx |
|---|---|---|---|---|
| 1 | Monday: one agent, on my laptop | fix one failing test (approval counter) → "you became the approve button" → the coffee break → five agents, one of you (still without isx: you're the scheduler now) → Homer (the stick, the drinking bird) → **your turn: yes or no?** (the audience game; the return overlay) → the allowlist you wrote one tired click at a time → "auto mode": a second model, usually right, 17% → "Usually?" / "My parachute usually opens." → the OpenJDK task in a process sandbox (10:00–10:36, six approvals) → "Fine. I give up. Do whatever you want. Just not on my machine. Here's one of your own." → meet the isx machine → where did your 36 minutes go → **Monday's choice**: the blueprint, stage 1 |
| 2 | Wednesday: five agents at once | (you got your afternoon back, so you started more agents) → git worktrees (one .git, shared) → Thursday afternoon (the poisoned ~/.m2) → "a worktree isolates your checkout, not the machine it runs on" → isx branching hero → every branch is a whole machine (and a git remote) → CoW clip → set up once → branch a live machine → a template declares the whole machine → to cache, or not to cache? → both: cached, and never stale → **Wednesday's choices**: stages 2 and 3 |
| 3 | Friday: code from strangers | "reproducer attached" → what that build can see (`env`) → the same look from isx → credentials never enter → an old principle, a new kind of ~~program~~ user → "it pushed at 3 a.m.; git blame says: you" → the agent acts as itself → a fair question: "can I just mount the repo into my IDE?" → the USB stick → "it works on my machine" → what comes back: a commit → getting it back is just git → "trust it like a PR from a new colleague" → **Friday's choices**: stages 4–6, then "This is isx." |
| 4 | After the week | the architecture on Linux and on macOS (the same picture, exactly as built) → every request passes one point (live account swap; the roadmap) → demo → others are working on the same problem → local-first → get started → then: `isx init` → built on → close (three beats; `isx ask` last) → backup |
| 5 | Fri | Everything it does is in your name. | An identity of its own. | a bot account per instance (signing: roadmap #271) |
| 6 | Fri | Getting the work back. | A commit, over git. Not a mount. | isx:// git remotes, review like a PR, rebuild the tests in a fresh branch |

After Friday: the same picture exactly as built (Linux, macOS), every request
passes one point, demo, the landscape, local-first, get started, close.
Backup holds what the story no longer needs on stage: the Docker and VM
tables, why a system container, network modes, what `isx branch` does, under
`git fetch`.


The deck makes the case for isx by walking a developer's path in small steps:
**a practical situation → the limitation it hits → the wish → how isx is designed
for it → what that looks like to use.** Every step earns the next one.

The device that ties it together is the blueprint (see "The spine" above): a picture of
your laptop that gains a part each time a choice is made, beside a ledger of *problem →
choice*. The three-questions yardstick it replaced is at tag `deck-v1-three-questions`.

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
| 0 | Hook | title → "hand the agent a task, walk away, come back to finished work" → every part of isx answers a problem from your first week; let's have that week |
| 1 | Monday: one agent, on my laptop | fix one failing test (approval counter) → "you became the approve button" → the coffee break → five agents, one of you (still without isx: you're the scheduler now) → Homer (the stick, the drinking bird) → **your turn: yes or no?** (the audience game; the return overlay) → the allowlist you wrote one tired click at a time → "auto mode": a second model, usually right, 17% → "Usually?" / "My parachute usually opens." → the OpenJDK task in a process sandbox (10:00–10:36, six approvals) → "Fine. I give up. Do whatever you want. Just not on my machine. Here's one of your own." → meet the isx machine → where did your 36 minutes go → **Monday's choice**: the blueprint, stage 1 |
| 2 | Wednesday: five agents at once | (you got your afternoon back, so you started more agents) → git worktrees (one .git, shared) → Thursday afternoon (the poisoned ~/.m2) → "a worktree isolates your checkout, not the machine it runs on" → isx branching hero → every branch is a whole machine (and a git remote) → CoW clip → set up once → branch a live machine → a template declares the whole machine → to cache, or not to cache? → both: cached, and never stale → **Wednesday's choices**: stages 2 and 3 |
| 3 | Friday: code from strangers | "reproducer attached" → what that build can see (`env`) → the same look from isx → credentials never enter → an old principle, a new kind of ~~program~~ user → "it pushed at 3 a.m.; git blame says: you" → the agent acts as itself → a fair question: "can I just mount the repo into my IDE?" → the USB stick → "it works on my machine" → what comes back: a commit → getting it back is just git → "trust it like a PR from a new colleague" → **Friday's choices**: stages 4–6, then "This is isx." |
| 4 | After the week | the architecture on Linux and on macOS (the same picture, exactly as built) → every request passes one point (live account swap; the roadmap) → demo → others are working on the same problem → local-first → get started → then: `isx init` → built on → close (three beats; `isx ask` last) → backup |

`slides.md` is the source of truth for the exact order; the sections below keep the reasoning,
the planned animations and the claims register. **`ANIMATIONS.md` specifies the animations**;
all are built; the cache flow follows incus-spawn PR #792 and is presented only once it has merged.

## Act 0 — The goal (2–3 slides)

1. **Title.** isx — safe machines for AI agents.
2. **The promise of agentic coding** is not a faster autocomplete; it's *dispatch several
   tasks, walk away, come back to finished work*. Hand the agent a terminal and it can do real work.
3. **The promise of the week**: every part of isx answers a problem from your first week
   with an agent; the talk is that week, and the blueprint fills in as it goes.

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
- Hero statement: *Fine. I give up. / Do whatever you want. / Just not on my machine. / Here's one
  of your own. Go work. Leave me alone.* (It replaced the recap and "you wouldn't hand a new hire
  your laptop"; the new-hire analogy lives on in the speaker notes.)
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
  - Release artifacts are cached, verified on store and confirmed with upstream on every hit (PR #792)
    before it's stored. Reusing your host `~/.m2` already requires its SHA-1 to **match upstream's `.sha1`**.
  - OCI layers are keyed and verified by their SHA-256 digest; npm tarballs by the registry's shasum.
- No latency number: the ~2.8 ms vs ~177 ms figures in `docs/PERFORMANCE-NOTES.md` (2026-08-28)
  predate the `HEAD` per hit that PR #792 adds, and its bench notes say they aren't comparable.
  The saving is stated as bandwidth: the download never travels twice.
- **[native]** Two requests racing: metadata passes straight through to Central every time; an
  artifact request checks the cache, then (for `~/.m2`) compares checksums, green → served
  locally, red → fetched fresh. Built as `CacheFlow.vue`, one row per request kind.

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
- Friday's choices complete the blueprint: "This is isx."
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
| 1 | Monday: one agent, on my laptop | fix one failing test (approval counter) → "you became the approve button" → the coffee break → five agents, one of you (still without isx: you're the scheduler now) → Homer (the stick, the drinking bird) → **your turn: yes or no?** (the audience game; the return overlay) → the allowlist you wrote one tired click at a time → "auto mode": a second model, usually right, 17% → "Usually?" / "My parachute usually opens." → the OpenJDK task in a process sandbox (10:00–10:36, six approvals) → "Fine. I give up. Do whatever you want. Just not on my machine. Here's one of your own." → meet the isx machine → where did your 36 minutes go → **Monday's choice**: the blueprint, stage 1 |
| 2 | Wednesday: five agents at once | (you got your afternoon back, so you started more agents) → git worktrees (one .git, shared) → Thursday afternoon (the poisoned ~/.m2) → "a worktree isolates your checkout, not the machine it runs on" → isx branching hero → every branch is a whole machine (and a git remote) → CoW clip → set up once → branch a live machine → a template declares the whole machine → to cache, or not to cache? → both: cached, and never stale → **Wednesday's choices**: stages 2 and 3 |
| 3 | Friday: code from strangers | "reproducer attached" → what that build can see (`env`) → the same look from isx → credentials never enter → an old principle, a new kind of ~~program~~ user → "it pushed at 3 a.m.; git blame says: you" → the agent acts as itself → a fair question: "can I just mount the repo into my IDE?" → the USB stick → "it works on my machine" → what comes back: a commit → getting it back is just git → "trust it like a PR from a new colleague" → **Friday's choices**: stages 4–6, then "This is isx." |
| 4 | After the week | the architecture on Linux and on macOS (the same picture, exactly as built) → every request passes one point (live account swap; the roadmap) → demo → others are working on the same problem → local-first → get started → then: `isx init` → built on → close (three beats; `isx ask` last) → backup |
| 5 | Credential swapping as unique to isx | **Not unique.** Claude Code sandbox `mask` mode and cloud-session git proxy exist. | Frame as "on by default, any agent, proxy outside the agent's machine, local". |
| 6 | "There is no audit trail" (old deck) | Overstated: git history and provider logs exist. | Rephrase: you can't tell *who* acted, the agent or you. |
| 7 | OpenJDK example timings and prompt count | `make images` measured at ~15 min with dependencies in place (2026-09-25). Clone/configure/test durations and the prompt count are still estimates. | Run it once under Claude Code's sandbox and count. |
| 8 | VM "~10% overhead" (DESIGN.md) | Unmeasured here. | Don't quote without a benchmark. |
| 9 | Landscape completeness | Docker Sandboxes (microVM per agent) and Anthropic cloud sessions (VM + credential proxy) are real alternatives. | **Done**: "Others are working on the same problem", before "Local-first": Docker Sandboxes as the one close match, then process sandboxes (Claude Code's, srt, Nono, Lince) and cloud sandboxes (cloud sessions, E2B, Daytona) as categories. Docker Sandboxes also injects credentials through a host-side proxy (docs.docker.com/ai/sandboxes/security), so the proxy is validation, not a differentiator; whole-machine CoW branching, templates and the git remote are. |

## Sources
- Claude Code sandboxing: https://code.claude.com/docs/en/sandboxing
- Choosing a sandbox environment: https://code.claude.com/docs/en/sandbox-environments
- Permission modes / auto mode: https://code.claude.com/docs/en/permission-modes
- How auto mode was built (error rates, 93% approval stat): https://www.anthropic.com/engineering/claude-code-auto-mode
- Docker ptrace / strace: https://jvns.ca/blog/2020/04/29/why-strace-doesnt-work-in-docker/ , https://github.com/containerd/containerd/issues/6802
- Ping without NET_RAW: https://www.antitree.com/2019/01/containers-using-ping-without-cap_net_raw/
- isx: `DESIGN.md`, `docs/VISION.md`, `docs/PERFORMANCE-NOTES.md`, `README.md` (Caching, Accounts), `proxy/…/MitmProxy.java` (`isMavenCacheable`, `fetchCacheAndServe`, `tryM2FallbackThenFetch`)
