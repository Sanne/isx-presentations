---
theme: default
title: isx — Safe machines for AI agents
colorSchema: dark
# Slidev disables text selection by default; we want slide text copyable.
selectable: true
canvasWidth: 1280
aspectRatio: 16/9
transition: fade
fonts:
  sans: Inter
  mono: JetBrains Mono
  weights: '400,500,600,700'
layout: cover
class: glow-accent
---

<div class="wordmark">isx</div>
<div class="subtitle">Safe machines for AI agents</div>
<p class="tagline">A machine for every agent. None of your credentials inside.</p>

---
layout: center
---

<h1 class="statement">Hand the agent a task, <span class="accent">walk away</span>, come back to finished work.</h1>

<p class="lead mt-6 mb-8 muted">Before I'd do that, three questions:</p>

<Yardstick :done="0" />

<!--
The yardstick for the whole talk: every act ends by ticking one box. Then: here's how that week actually goes.
-->

---
layout: center
class: divider
---

<div class="ghost">01</div>

# Monday: <span class="accent">one agent, on my laptop</span>

<p>A failing test. How hard can it be?</p>

---
clicks: 5
---

## Fix one failing test

<Term scene="fixTest" class="mt-2" />

<!--
Narrate it as it happens: the test run, the dependency check, the re-run, the full suite, the commit. Each prompt is reasonable on its own. Pause on the last line.
Stylised reconstruction of a typical session, not a screenshot of one tool.
-->

---
layout: center
---

<h1 class="statement">You wanted to delegate.<br><span class="warn">You became the approve button.</span></h1>

<p class="note mt-10">Anthropic measured it: Claude Code users approve 93% of permission prompts.</p>

<!--
Source: anthropic.com/engineering/claude-code-auto-mode. At 93%, the prompt has stopped being a decision.
-->

---
clicks: 2
---

## So you try to walk away

<Term scene="coffee" class="mt-2" />

<!--
It can't finish without you, so you can't leave. This is the real cost, more than the annoyance.
-->

---
layout: center
---

<h1 class="statement">Meanwhile, it's the AI era,<br>and <span class="warn">everyone expects more from you.</span></h1>

<p class="lead mt-8">Agents are cheap and never get tired. Running one at a time starts to look like a waste.<br>So the obvious move: run five.</p>

<!--
The bridge from one agent to five. It's not greed, it's the expectation now: the tools are cheap, the demos show five agents in parallel, and someone is asking why your output didn't go up. Say it with a straight face, then click on and let the next slide answer it.
-->

---
clicks: 2
---

## And now run <span class="warn">five of them</span>

<p class="lead">Five agents, five streams of prompts. One of you, switching between them.</p>

<FiveAgents class="mt-6" />

<!--
Click 1 plays 30 minutes in about 25 seconds; let it run and narrate the face. Click 2: the verdict.
Illustrative, not measured: the lanes are simulated with one rule, that you answer prompts in the order they arrive and each one costs you a minute and a half of reading and switching back. Nothing else is tuned; the queue does the rest.
-->

---
clicks: 1
---

## Homer solved this <span class="muted">in 1995</span>

<HomerFrames :show="[0, 1]" class="mt-2" />

<p class="note pin"><em>The Simpsons</em>, "King-Size Homer" (1995). Homer's job: answering the safety prompts at the nuclear plant.</p>

<!--
Two frames here: he replaces his finger with a stick, then automates it with a drinking bird and goes to the cinema. What he comes back to is held for the end of the game on the next slide.
The frames are fetched by tools/fetch-memes.sh and not committed (the repo is public); without them the slide shows an original drawing.
-->

---
clicks: 2
---

## Your turn: <span class="accent">yes</span> or <span class="danger">no</span>?

<p class="lead">A command every couple of seconds. Shout yes or no. Then watch the drinking bird.</p>

<ApproveLoop class="mt-4" :start-at="1" :stop-at="2" :period-ms="2400" />

<HomerReturn v-click="2" />

<!--
Explain the game before the first click: I'll show a command, you shout YES or NO. Click 1 (space / →) starts it. Keys Y and N record what the room shouted for the command on screen, and the bird approves it anyway; the tally counts how often the room said no. Y/N work from the presenter window too. The ordinary and the outrageous are mixed on purpose: after a few, nobody reads them any more, which is the point. Whatever the room shouts, the bird approves it. Let it run for a dozen; click 2 freezes the game and shows what Homer came back to: "Situation critical. Explosion imminent." Then: the next slide is the drinking bird, in Claude Code's terms.
-->

---

---
clicks: 7
---

## So you click <span class="warn">"Yes, and don't ask again"</span>

<ul class="rules mt-2" :class="{ real: $clicks >= 6 }">
  <li class="head"><span>it asked</span><span class="why">you thought</span><span class="rule">it saved</span><span class="is">which allows</span></li>
  <li v-click="1"><code>mvn -q test</code><span class="why">it needs to build</span><span class="rule"><code>Bash(mvn *)</code></span><span class="is">any code any plugin brings</span></li>
  <li v-click="2"><code>git commit -am "wip"</code><span class="why">it needs to commit</span><span class="rule"><code>Bash(git commit *)</code></span><span class="is ok">reasonable</span></li>
  <li v-click="3"><code>curl -LO https://download.java.net/…</code><span class="why">it needs a boot JDK</span><span class="rule"><code>Bash(curl *)</code></span><span class="is">sending anything, anywhere</span></li>
  <li v-click="4"><code>docker run -d postgres:17</code><span class="why">Testcontainers</span><span class="rule"><code>Bash(docker run *)</code></span><span class="is">root on your laptop, via the socket</span></li>
  <li v-click="5"><code>rm -rf target/</code><span class="why">it's cleaning up</span><span class="rule"><code>Bash(rm *)</code></span><span class="is">deleting anything you can</span></li>
</ul>

<p v-click="7" class="lead mt-8">Each one made sense at the time. Read back, <span class="danger">it's a security policy far broader than anything you meant to allow.</span></p>

<!--
Build the list slowly: the command it asked about, the reason you said yes, and (a beat later) the rule that got saved: one prefix, every argument. On click 6 the reasons turn into what each rule actually permits.
Rule syntax per code.claude.com/docs/en/permissions: "Yes, and don't ask again" saves a prefix rule, per repository.
Verified against Claude Code 2.1.282 (2026-09-25): the interactive prompt's option reads "Yes, and don't ask again for:" with an editable field pre-filled with a prefix. It keeps the command's first word and at most one following word, and stops at the first flag (docker is allowed one more word). So "mvn -q test" pre-fills "mvn *", "git commit -am" gives "git commit *", "curl -LO …" gives "curl *", "docker run -d …" gives "docker run *", and "rm -rf target/" gives "rm *". You can edit the prefix; the point is that nobody does. (Headless -p mode suggests the exact command instead; this slide is about the interactive prompt.)
If asked: docker run * still covers docker run --privileged -v /:/host, hence "root on your laptop".
-->

---
clicks: 3
---

## And tomorrow?

<Term scene="nextRepo" class="mt-2" />

<!--
Claude Code saves "Yes, and don't ask again" for Bash "permanently per repository and command" (code.claude.com/docs/en/permissions). A new repository, a new tool, a new host: new prompts.
-->

---
layout: center
---

<h1 class="statement">Too broad to be safe.<br><span class="warn">Too narrow to leave it alone.</span></h1>

---
layout: center
---

<h1 class="statement">Or you turn on "auto mode", and<br><span class="warn">a second model</span> decides what's safe.</h1>

<p class="lead" style="margin-top: 28px">It's usually right.</p>

<p class="note" style="margin-top: 48px">Anthropic publishes a 17% miss rate on real overeager actions, and calls it "a per-action control, not an isolation boundary".</p>

<!--
Be fair: auto mode is a real improvement for interactive work. The classifier is Sonnet 5 by default, a separate call that doesn't see tool outputs; when the session also runs Sonnet 5 it is literally another instance of the same model. It goes back to prompting after 3 blocks in a row or 20 per session. On API/Enterprise accounts its calls count toward token usage.
Sources: anthropic.com/engineering/claude-code-auto-mode; code.claude.com/docs/en/permission-modes; code.claude.com/docs/en/sandbox-environments.
-->

---
layout: center
clicks: 1
---

<h1 class="statement"><span class="warn">"Usually"?</span></h1>

<p v-click="1" class="lead mt-8" style="font-size: 44px; color: var(--text)">My parachute usually opens.</p>

<!--
Deadpan. Let "Usually?" sit for a second, click, and let the laugh happen. Then the plain version, spoken: for commands that run as you, on your laptop, "usually" isn't good enough.
Alternative punchline if it suits the room better: "Usually, logging into my bank doesn't empty my savings."
-->

---
clicks: 7
---

## Or a process sandbox, and a task that needs <span class="warn">a real machine</span>

<Term scene="openjdkSandbox" class="mt-2" />

<!--
The story: "I wish I had a patched OpenJDK." Keep the clock in view: 10:00 to 10:36, and you never left your desk. configure stops at the first missing library, so the agent meets them one at a time, each needing sudo. The sandbox confines the commands it runs, but a real task keeps needing things outside it: new hosts, sudo, Docker ("docker is incompatible with the sandbox", per its docs).
Measured: make images takes ~15 minutes with the dependencies in place (2026-09-25). Still to check: the clone, configure and test durations, and that the prompts match what the sandbox really asks.
Source: code.claude.com/docs/en/sandboxing (escape hatch; Troubleshooting: docker; Limitations).
-->

---
layout: center
clicks: 3
---

<h1 class="statement giveup">Fine. <span class="warn">I give up.</span></h1>

<h1 v-click="1" class="statement giveup">Do whatever you want.</h1>

<h1 v-click="2" class="statement giveup"><span class="danger">Just not on my machine.</span></h1>

<h1 v-click="3" class="statement giveup"><span class="accent">Here's one of your own.</span></h1>

<h1 v-click="3" class="statement giveup">Go work. Leave me alone.</h1>

<!--
The turn of the talk. Prompts, allowlists, a second model, a sandbox: every one of them tried to judge the agent's commands one at a time, on your laptop. Say it like someone who has had enough.
Beat by beat: "Fine. I give up." (pause) Click: "Do whatever you want." Click: "Just not on my machine." Click: "Here's one of your own. Go work. Leave me alone."
It's what we already do for people: you don't review a new hire's every command, and you don't hand them your laptop; you give them a machine of their own. The question changes from "may this command run?" to "where does it run?". A sandbox confines what the agent runs; a machine of its own is the thing it runs on.
-->

---
clicks: 4
---

## Meet the isx machine

<IsxBox class="mt-2" />

<!--
Click by click: your laptop and your things; an isx machine appears beside them; inside, agentuser has passwordless sudo over its own machine, so it never needs to ask; it can't reach your home or your credentials (not mounted, never inside), only HTTPS through the proxy; and if it breaks its machine, you destroy it and branch another.
Honest limit, for the VM slide: a container shares the host kernel.
-->

---
clicks: 3
---

## The same task, <span class="accent">on its own machine</span>

<Term scene="openjdkIsx" class="mt-2" />

<!--
Same request as the sandbox scene. The same configure failures happen; the agent just installs what is missing and carries on. Keep the clock in view: 10:24, and you were not there.
-->

---
clicks: 2
---

## Where did <span class="accent">your</span> 36 minutes go?

<ThirtyMinutes class="mt-2" />


<!--
Click 1 plays "With prompts": narrate it as your morning. The agent stops, you don't notice because you're in the PR; you notice, answer, and try to get back into the PR; the answers get sloppier; at 10:14 you give up and just watch it, clicking yes. Point at the face. Click 2 plays "On isx". Then: the build took about as long; what changed is who had to be there.
make images is measured (~15 min); the rest is estimated. The gap between the two runs is exactly the waiting: 11½ minutes.
-->

---

## Why <span class="accent">a system container</span>?

<div class="cards three mt-4">
  <div class="card warn"><h4>Docker / Podman</h4><p>Built to ship one app. No init by default, nested containers need <span class="kw">--privileged</span>, <span class="kw">perf</span> is blocked by the default seccomp profile. All of it configurable; none of it the default.</p></div>
  <div class="card warn"><h4>A VM per agent</h4><p>The strongest boundary: its own kernel. Also a memory guess per agent, and a guest kernel's worth of cost each, so fewer fit on a laptop.</p></div>
  <div class="card"><h4>An isx machine</h4><p>A full distribution with its own init, where nested containers and profilers just work. It shares the host kernel, so it's cheap enough to branch one per task.</p></div>
</div>

<p class="note pin">Containers share the host kernel. For code you believe is malicious, build the template as a VM: <span class="kw">isx build tpl-java --type vm</span>. Full comparison: backup slides.</p>

<!--
The two comparison tables are in the backup section at the end, for questions.
Docker: ping and strace work by default (ping_group_range since 2020, ptrace allowed on kernel ≥ 4.8); only say what's true. Podman supports systemd in containers.
VM memory: a guest reserves its RAM and its kernel fills it with page cache; containers get a ceiling (isx: 60% of host RAM), not a reservation, and one kernel shares cache, swap and priorities across all of them.
-->

---
layout: center
---

<Yardstick :done="1" :why="[]" />

<!--
No list here: the last three slides made the case. If you want one line: it didn't need you, because it had a machine of its own and nothing of yours was in it.
-->

---
layout: center
class: divider
---

<div class="ghost">02</div>

# Wednesday: <span class="accent">five agents at once</span>

<p>Parallel work, without stepping on each other</p>

---
clicks: 3
---

## You know <span class="muted">git worktrees</span>

<Machines mode="worktrees" class="mt-2" />

<!--
For those who haven't used them: one repository, several branches checked out side by side in separate directories, all sharing one .git. It's how most people run parallel agents today.
Click by click: the repository; three checkouts, and the thing everyone likes about worktrees: they share one .git, so a commit in any checkout can be merged from any other; they all sit on one machine; the collisions.
-->

---
clicks: 4
---

## Two agents, <span class="warn">one localhost</span>

<PortStory class="mt-2" />

<p v-click="4" class="lead mt-4">Two agents, both confidently wrong, and <span class="danger">neither can see why.</span></p>

<!--
Tell it click by click. A's database is up on 5432 and migrated to A's new schema. B brings up its own database: the port is taken, but B's wait-for-db check passes, because something answers on 5432. B's integration tests pass, against A's database. B's teardown truncates the tables, and A's tests start failing: A goes debugging its own code.
The easy case, a server that can't bind its port, fails loudly. This one doesn't.
-->

---
clicks: 5
---

## Thursday afternoon

<SnapshotStory class="mt-2" />

<p v-click="5" class="lead mt-3">Nobody touched B's code. The lost afternoon isn't the real cost: <span class="danger">B's evidence is poisoned, and it committed a fix for a bug it never understood.</span></p>

<!--
Tell it as a story, row by row, without explaining. Let the audience wonder why B's numbers move. Only on the last click does the ~/.m2 column light up: A's mvn install overwrote the SNAPSHOT that B's build was using. Dwell on B: it did everything right, collected evidence for two days, and the evidence itself was corrupted. It's now confidently wrong, and so are you if you trust its write-up.
-->

---
layout: center
---

<h1 class="statement">A worktree isolates your checkout.<br><span class="warn">Not the machine it runs on.</span></h1>

<p class="lead mt-8 muted">Ports, services, tools, caches, and yesterday's leftovers: all still shared.</p>

<!--
The worktrees diagram already listed what is shared; this is the one-line wish before the answer. "Yesterday's leftovers" matters: they teach the agent solutions that only work on your laptop.
-->

---
layout: center
class: glow-accent
---

<div class="statement">
  <div class="mono accent" style="font-size: 46px">isx</div>
  <div style="font-size: 106px; font-weight: 700; letter-spacing: -0.035em; line-height: 1.08" class="accent">branching</div>
  <div style="font-size: 40px">for the entire machine</div>
</div>

---
clicks: 3
---

## Every branch is <span class="accent">a whole machine</span>

<Machines mode="isx" class="mt-2" />

<!--
Same picture as the worktrees slide, on purpose: what was one shared machine at the bottom is now inside each box. Each branch has its own ports, ~/.m2, tools, services and IP, starts from the same clean template, and is destroyed rather than cleaned up.
Click 3, the callback to worktrees: you keep the git workflow. Each machine is a git remote of your repository (isx://agent-1/~/shop), so git fetch, git push and git pull work as they do between any two repositories; isx adds and removes the remote for you when host-paths is configured. The details come on "Getting it back is just git".
-->

---

## Branching: <span class="accent">shared, not copied</span>

<McPlayer src="/mc/cow.js" />

<!--
Each square is a block of a machine's disk; the caption at the top narrates each step and the legend says how to read the squares. Git shares objects between branches. isx shares disk blocks between machines: the same trick, one layer down.
Copy-on-write needs a storage pool that supports it (btrfs, ZFS, LVM thin); on one that doesn't, isx branch warns and makes a full copy.
-->

---
clicks: 3
---

## Set up once. <span class="accent">Every branch starts ready.</span>

<TemplateRace />

<p class="note pin">Templates compose: a <span class="kw">parent:</span> plus <span class="kw">tools:</span> picked by name, not <span class="kw">RUN</span> lines copied between Dockerfiles. <span class="kw">isx update-all</span> keeps them fresh: packages updated, repositories fetched.</p>

<!--
The slow part of any task is the setup. In isx it happens when the template is built, not when the agent starts: the repositories are already cloned, the tools installed, and the build has already run once, so the dependencies are downloaded and cached. A branch is a copy of that finished state, so the agent's first command is the useful one.
Two separate approaches, one panel each, running the same three tasks. In each panel the dashed line is the moment the tasks start; left of it is ahead of time. Every task does the same real work (explore and patch, then test); only the setup in front of it differs. Keeping templates fresh (footnote): isx update-all updates system packages and git-fetches the repos in every template; --prime also re-runs each repo's prime command, so the cached dependencies catch up too. Between refreshes an agent can always git fetch in its branch; the build then downloads only what changed, as on your laptop after a git pull. The dependency step is deliberately modest: many people have some cache. Top, click 1: each task on a new, empty machine repeats the whole setup before its first test, and the counter shows the cost twice over: setup time three times, and three copies of the tools and dependencies on disk. Bottom, click 2: the template ran the setup once, ahead of time; each task is a branch of it and starts with the test. Time paid once; disk stored once and shared by copy-on-write. Click 3: the point.
Honest framing if asked: a prebuilt container image also avoids repeating the setup; what isx adds is a whole machine, branched in seconds, sharing its disk, and branchable from a running machine (next slide).
Composition (footnote): a template names one parent and a list of tools; isx builds it by copying the parent (copy-on-write) and adding only that layer's packages and tools, so shared layers are stored once too (BuildCommand: "Build an image by copying its parent and applying layers"). The YAML slide shows one.
MEASURE before quoting any number: a real template build, and an isx branch plus the first mvn -q test, on this laptop. Until then it's "minutes" against "seconds", in words.
-->

---
clicks: 3
---

## Branch a <span class="accent">live</span> machine

<p class="lead">Branch a machine mid-task, twice. Try fix A and fix B <span class="accent">at the same time</span>, from the same state, and nobody repeats the setup.</p>

<LiveBranch class="mt-6" />

<!--
The story everyone has lived: a bug report comes in, and it takes an hour to reproduce. The agent checked out the version from the report, built it with the same dependencies, and wrote a test that fails every time. Now try two fixes from that exact state. Click 1: that machine. Click 2: two branches of it. Click 3: they go their own ways.
What carries over: isx branch --from <instance> copies the instance's disk, and the branch boots its own systemd. The checkout, the build and the test come along; nothing in memory does.
The demo's Postgres fork shows the same mechanism live.
-->

---

## A template <span class="accent">declares the whole machine</span>

<div class="dense">

```yaml {1-3|4-7|8-11|12-15|16-18}
name: tpl-quarkus
description: Quarkus development box
parent: tpl-mydev
tools:
  - podman
  - mvnd
  - claude: {model: claude-sonnet-5}
skills:                      # baked into the template
  repo: myorg/claude-skills
  list:
    - code-review
agent_note: |                # added to the agent's CLAUDE.md
  Prefer mvnd over mvn for repeated builds:
  it takes the same goals and flags.
repos:
  - url: https://github.com/quarkusio/quarkus.git
    prime: mvnd -b singlethreaded -Dquickly
```

</div>

<p class="note pin">OS, tools, repositories, skills and the agent's briefing in one file, reviewed and versioned like code. Any machine can be rebuilt from it. Not bit for bit: packages and repositories resolve at build time.</p>

<!--
Don't say "deterministic" or "reproducible": the base image tracks the newest release unless pinned (isx update-base <tag>), dnf resolves package versions at build time, and repos are cloned at their current HEAD. What is true: the whole machine is declared in one reviewed file, and rebuilding from it gives the same kind of machine. The TUI flags templates whose definition changed since the last build; isx build --out-of-sync rebuilds them.
-->

---
layout: center
clicks: 4
---

<Yardstick :done="2" :why="[
  'They can\'t interfere: each has its own ports, caches, services and files',
  'They share the hardware: one kernel, copy-on-write disks, no RAM reserved up front',
  'And they don\'t need you: no prompts to juggle, so five agents aren\'t five tabs to babysit',
]" />

<!--
One reason per click, then the tick on the last click. Three things had to be true, and each was shown: isolation (the port story, Thursday afternoon, every branch a whole machine), density (the CoW clip, the system-container card), and your own attention (the 36-minutes animation from Monday, now multiplied by five).
-->

---
layout: center
class: divider
---

<div class="ghost">03</div>

# Friday: <span class="accent">code from strangers</span>

<p>A reproducer, and your credentials</p>

---
clicks: 3
---

## "Reproducer attached: <span class="kw">mvn verify</span>"

<p class="lead">A user files a bug and attaches a small project that reproduces it.</p>

<p v-click="1" class="lead mt-6">You read the 40 lines of Java. Harmless.</p>

<p v-click="2" class="lead mt-6">Did you read the <span class="kw">pom.xml</span>? The build plugin it pulls in? <span class="warn">That plugin's dependencies?</span></p>

<p v-click="3" class="lead mt-6">You approved <span class="kw">mvn verify</span>. <span class="danger">Everything it runs, runs as you.</span></p>

<p class="note pin">A sandbox doesn't help when you approved the run. On isx it runs on a throwaway branch; for code you believe is actively malicious, use <span class="kw">--type vm</span>.</p>

---
clicks: 2
---

## What that build <span class="danger">can see</span>

<Term scene="secretsLaptop" class="mt-2" />

<!--
Values are truncated fakes. The point: the agent needs to clone, push and call the model, so the usual setup puts tokens where every process it starts can read them. A good model won't go looking; a dependency might.
-->

---
layout: center
---

<h1 class="statement">The agent doesn't need to see any key.<br><span class="accent">So on isx, it can't.</span></h1>

---
clicks: 3
---

## The same look, <span class="accent">from an isx machine</span>

<Term scene="secretsIsx" class="mt-2" />

<!--
Mirrors the demo script's beat 2: GH_TOKEN is a placeholder, and gh still authenticates, as the agent's own bot account.
-->

---
clicks: 5
---

## Credentials <span class="accent">never enter</span>

<ProxyFlow class="mt-10" />

<!--
To extend: show the request as an HTTP message with headers, and the x-api-key line rewriting at the proxy; a second pass for git push with a GitHub token.
-->

---
clicks: 3
---

## Network modes

<table class="mt-2">
  <thead><tr><th>Mode</th><th>Flag</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td>Full internet</td><td class="muted">(default)</td><td>Unrestricted access; authentication via the proxy</td></tr>
    <tr><td>Proxy only</td><td><span class="kw">--proxy-only</span></td><td>All outbound traffic dropped except the proxy and DNS</td></tr>
    <tr><td>Airgapped</td><td><span class="kw">--airgap</span></td><td>Network device removed</td></tr>
  </tbody>
</table>

<NetworkModes class="mt-6" />

<!--
One click per panel: the same machine and the same three requests each time. api.anthropic.com and github.com go through the proxy because isx intercepts them (github.com when the template has gh); evil.example stands for any other host.
Airgapped runs no agent: the agent needs its model's API, and there's no network at all. It's for running code you don't trust, like Friday's reproducer: let the agent prepare a machine with network, then branch it with --airgap (isx branch run-1 --from repro-1 --airgap) and run only the tests. Dependencies have to be there already, from the template's prime step or the agent's earlier build. (An agent with a local model inside the machine could work offline, but isx doesn't set that up.)
-->

---

## An old principle, <span class="accent">a new kind of <s class="struck">program</s> user</span>

<div class="quote mt-2">"Every program and every user of the system should operate using the least set of privileges necessary to complete the job."<cite>Saltzer &amp; Schroeder, <em>The Protection of Information in Computer Systems</em>, 1975</cite></div>

<div class="quote mt-6">"Implement authorization in downstream systems rather than relying on an LLM to decide if an action is allowed or not."<cite>OWASP Top 10 for LLM Applications 2025, LLM06: Excessive Agency</cite></div>

<div class="quote mt-6">Private data, untrusted content, and a way to send data out: an agent with all three can be tricked into leaking it.<cite>Simon Willison, "The lethal trifecta", 2025 (paraphrased)</cite></div>

<p class="note pin">isx applies them structurally: your credentials and files aren't in the machine, the host enforces the boundary rather than a model, and <span class="kw">--proxy-only</span> or <span class="kw">--airgap</span> cut the way out when the code itself is sensitive.</p>

<!--
The title's joke: is an agent a program or a user? It's a program that behaves like a user: it reads, decides, and acts with your permissions. Read the first quote slowly: "every program and every user". Saltzer and Schroeder covered both in 1975.
The lethal trifecta is paraphrased, not quoted. isx removes your credentials and personal files from the machine; the repository it works on may still be private, which is what the network modes are for.
The idea is spreading: credential-injecting proxies now appear in Claude Code's sandbox (mask mode) and Anthropic's cloud sessions. Mention as validation if asked.
Sources: Saltzer & Schroeder 1975; genai.owasp.org/llmrisk/llm062025-excessive-agency; simonwillison.net/2025/Jun/16/the-lethal-trifecta.
-->

---

## The agent acts <span class="accent">as itself</span>

<p class="lead">It should read issues on your private repos. It shouldn't sign off anything <em>as you</em>.</p>

<div class="cards mt-6">
  <div class="card"><h4>Its own account <span class="tag shipped">shipped</span></h4><p>Each instance can use its own bot account: commits are authored by it, and it can do only what you granted the bot. Its outward-facing work comes to you for review.</p></div>
  <div class="card warn"><h4>Its own signature <span class="tag roadmap">roadmap</span></h4><p>Commit signing with a key that never leaves the host (#271).</p></div>
</div>

<p class="lead mt-8">An agent is <span class="accent">a principal</span>, not a process: it gets an identity, and the identity gets exactly the access it needs.</p>

---
layout: center
---

<h1 class="statement">You still review its work.<br>The question is <span class="accent">what</span> you're reviewing.</h1>

---
clicks: 3
---

<UsbStranger class="mt-4" />

<p v-click="3" class="lead mt-4">Your security training says never to plug in that stick. A read-write share is that stick: whatever the agent writes there, <span class="danger">your IDE, git hooks and build run next, on your laptop, with your permissions, your keys and your files.</span></p>

<!--
The oldest trick in security, retold. Let the first bubble land ("skip the git dance" is the pitch every read-write share makes: convenience). Click 1: "It's just… executable code. Trust me." Click 2, the afterthought: "Only some of it was downloaded from the internet." Let the laugh happen. Click 3: the plain version, and the hook the room already knows: every company's security awareness training has the found-USB-stick rule, and its policy on running unreviewed code. Ask: would your security team sign off on this folder? Then move on; the next slide shows the timing problem.
It's accurate, not a caricature: a working tree is full of things your tools execute without asking (build scripts, the Gradle/Maven wrappers, git hooks, IDE run configurations, .envrc), and an agent that downloaded dependencies or scripts writes them there. Docker Sandboxes mounts your working tree read-write by default; process sandboxes run in it directly. The next slide shows the timing problem even with an honest agent.
-->

---
clicks: 3
---

## Why not just mount the repo <span class="warn">into your IDE?</span>

<div class="race mt-4">
  <div class="race-row"><span class="t">10:00</span><span>You open <span class="kw">build.sh</span> and read it. Looks fine.</span></div>
  <div v-click="1" class="race-row"><span class="t">10:01</span><span>The agent, still working, edits <span class="kw">build.sh</span>.</span></div>
  <div v-click="2" class="race-row"><span class="t">10:02</span><span>You run the build. <span class="danger">It runs the version you never read, on your laptop, as you.</span></span></div>
</div>

<p v-click="3" class="lead mt-8">A live directory means your review is never final. And your IDE runs project configuration the moment you open the folder.</p>

<!--
From the isx README FAQ: a project directory is an implicit code execution channel (build plugins, Makefiles, gradlew, git hooks, IDE run configurations), and a live mount adds a race between review and execution. It's also misleading: the agent's SNAPSHOTs and node_modules don't come through the mount.
The IDE still works: JetBrains Gateway / VS Code Remote run the backend inside the machine.
-->

---
clicks: 4
---

## What comes back: <span class="accent">a commit</span>

<div class="flow mt-6">
  <div class="step">isx machine <b>agent-1</b><span>built and tested from <code>tpl-java</code></span></div>
  <div v-click="1" class="step">commit <b>3f2a91c</b><span>immutable text</span></div>
  <div v-click="2" class="step"><code>git fetch agent-1</code><span><code>git diff</code>: read it like any PR</span></div>
  <div v-click="3" class="step">a fresh branch<span>re-run the tests from the same template</span></div>
  <div v-click="4" class="step">cherry-pick<span>or throw it all away</span></div>
</div>

<p class="note pin">Want to watch it work? Your IDE connects <em>into</em> the machine (JetBrains Gateway, VS Code Remote), so nothing it writes runs on your laptop.</p>

---
clicks: 3
---

## Getting it back is <span class="accent">just git</span>

<Term scene="gitLoop" class="mt-2" />

<!--
Between click 0 and 1: the agent works inside agent-1 and commits. The remote appears when the branch is created and disappears when it's destroyed. What you fetch is a specific commit: it can't change between your review and your cherry-pick. isx's own output lines are paraphrased.
-->

---
layout: center
---

<h1 class="statement">Trust it like a pull request <span class="accent">from a new colleague</span></h1>

<p class="lead mt-8">isx doesn't make its code correct.<br>It makes it reviewable, and keeps it contained until you have.</p>

<!--
The three reasons come on the next slide, with the tick. Don't list them here too.
-->

---
layout: center
clicks: 4
---

<Yardstick :done="3" :why="[
  'What comes back is a commit, not a live directory',
  'Tested in an environment anyone can rebuild',
  'None of it ran on your laptop before you reviewed it',
]" />

---
layout: center
class: divider
---

<div class="ghost">04</div>

# Under <span class="accent">the hood</span>

<p>How it's built</p>

---
clicks: 3
---

## The architecture, <span class="accent">on Linux</span>

<Arch platform="linux" class="mt-1" />

<!--
Click 1: the CLI and TUI talk to the Incus daemon's REST API over its unix socket; Incus CoW-copies templates into branches on a btrfs pool.
Click 2: a machine's HTTPS to intercepted domains resolves to the bridge gateway (dnsmasq), is redirected to isx-proxy, which adds the real credentials and forwards upstream.
Click 3: git reaches a machine through Incus exec over a WebSocket.
-->

---

## What <span class="kw">isx branch</span> does, in seconds

<ol class="steps mt-4">
  <li v-click>CoW-copies the template: a btrfs snapshot, no data copied</li>
  <li v-click>Gives it a static IP, written into its network config before it boots</li>
  <li v-click>Installs your SSH key: <span class="kw">ssh agent-1</span> just works</li>
  <li v-click>Adds an <span class="kw">isx://agent-1/…</span> git remote to each matching checkout on your laptop</li>
  <li v-click>Tells the proxy which accounts this machine uses</li>
  <li v-click>Starts it, and drops you into a shell or starts the agent</li>
</ol>

<p v-click class="note pin"><span class="kw">isx destroy</span> undoes all of it: the machine, its disk delta, its SSH key and its git remotes.</p>

---
clicks: 3
---

## The architecture, <span class="accent">on macOS</span>

<Arch platform="macos" class="mt-1" />

<!--
isx provisions a small Linux appliance: Alpine, a custom kernel with every driver built in, no initrd, no SSH, started by vfkit on Apple's Virtualization framework.
Click 1: the CLI reaches Incus through a vsock tunnel (vm.incus.sock → virtio-vsock → socat → Incus). Why vsock: corporate VPN clients (e.g. Cisco AnyConnect) install socket filters that block unsigned binaries from TCP to the VM subnet; AF_VSOCK isn't TCP.
Click 2: the proxy runs on the Mac (launchd); the VM DNATs port 443 from the bridge to the Mac's :18443.
Click 3: a second vsock channel reaches isx-agent, a tiny shell agent that only accepts a fixed list of verbs (ping, version, socat-count, sshd-status, forwarder-restart, btrfs-usage, btrfs-status, btrfs-rescan), never arbitrary commands. Three users: the automatic recovery in VmManager.ensureRunning() and isx doctor both compare host-side fds with the in-VM socat count to find a wedged forwarder and restart it, even when the Incus channel is stuck; and because the btrfs pool lives inside the VM, the TUI's pool-usage figures come through its btrfs-usage verb (on Linux the same read is a scoped sudoers rule instead).
Sources: DESIGN.md (Incus Daemon Connection, macOS vsock robustness), appliance/DESIGN.md (Boot Backends, First-Boot Initialization, Control agent).
-->

---
clicks: 2
---

## Under <span class="kw">git fetch agent-1</span>

<GitHelper class="mt-2" />

<!--
The hops: git sees an isx:// URL and runs git-remote-isx; that hands over to the native isx helper, which checks the machine exists and only allows the git service; Incus exec opens git-upload-pack inside the machine, and the pack stream flows through the WebSocket untouched.
If asked why there's a bash shim in front of the native helper: git's helper protocol starts with a few text lines, then switches to binary on the same pipe. Java's buffered stdin would read ahead into the binary stream; bash answers the text lines, then execs, so the native helper inherits a clean pipe. (DESIGN.md, "Git remote helper: bash + Java split".)
-->

---
clicks: 3
---

## To cache, <span class="warn">or not to cache?</span>

<div class="cards three equal dilemma mt-4">
  <div class="card warn"><h4>"Cache it, obviously."</h4><p class="voice">Every build downloads the same internet again, and keeps its own copy. Nothing shared, on the wire or on disk: slow builds, rate limits, and a flaky network deciding whether your tests pass.</p></div>
  <div v-click="2" class="card you"><h4>You</h4><p class="voice">"I don't have fibre. I can't download 1,500 dependencies again for every reproducer. And I don't want cache problems either."</p></div>
  <div v-click="1" class="card danger"><h4>"Never cache anything."</h4><p class="voice">Caches bite, in ways you can't predict. Remember Thursday afternoon: one shared <span class="kw">~/.m2</span>, and two days of evidence poisoned. A build you can't reproduce is one you can't trust.</p></div>
</div>

<h1 v-click="3" class="statement dilemma-q">Could we have <span class="accent">both</span>?</h1>

<!--
Play both colleagues straight: each is right. Left first, then right, then you, stuck in the middle. The first is the "Set up once" argument again: without a cache, every machine downloads its own copy and keeps it, so nothing is shared, not even on disk. The second is the one who lost Thursday afternoon. Then click: could we have both? The next slide is the answer.
DO NOT PRESENT this slide without the next one, and that one waits for incus-spawn #555.
-->

---

## Caching, <span class="accent">without surprises</span>

<ul class="mt-2">
  <li>Maven metadata and <span class="kw">-SNAPSHOT</span>s <span class="accent">always go upstream</span>: they can change</li>
  <li>Release artifacts are cached, and <span class="accent">checked against upstream's checksum</span> before they're stored</li>
  <li>Container layers are keyed and verified by their SHA-256 digest</li>
</ul>

<div class="stats mt-6">
  <div class="stat"><b class="accent">~2.8 ms</b><span>a 642 KB artifact from the cache, over TLS</span></div>
  <div class="stat"><b class="muted">~177 ms</b><span>the same artifact from Maven Central</span></div>
</div>

<Todo class="mt-6">Metadata requests pass straight through; artifact requests check the cache, compare checksums, then serve locally or fetch fresh.</Todo>

<!--
DO NOT PRESENT until incus-spawn #555 ships: today, release artifacts fetched from upstream are cached without verification.
Figures: docs/PERFORMANCE-NOTES.md, measured 2026-08-28 on 2 proxy cores.
-->

---

## Every request passes <span class="accent">one point</span>

<p class="lead">Swap the account an agent uses, while it runs: <span class="tag shipped">shipped</span></p>

```bash
isx account set agent-1 claude=personal
```

<p class="note mt-2">The next request uses the new account. Nothing inside restarts, and the agent can't tell.</p>

<p class="note" style="margin-top: 4px">(Switching between Claude auth modes is the exception: that's fixed at template build.)</p>

<p class="lead mt-6">And because every API call passes there, without touching the machine: <span class="tag roadmap">roadmap</span></p>

<div class="cards mt-3">
  <div class="card warn"><h4>Activity</h4><p>Working, waiting for you, or stuck?</p></div>
  <div class="card warn"><h4>Spend</h4><p>Live token usage per agent.</p></div>
  <div class="card warn"><h4>Audit</h4><p>Every call observable, fully transparently.</p></div>
  <div class="card warn"><h4>Routing</h4><p>Model calls re-routed on the fly.</p></div>
</div>

<!--
The roadmap half is direction, not a feature: incus-spawn #322.
-->

---
layout: center
class: glow-accent
---

<h1 class="statement">Demo</h1>

<!--
Branch (seconds, from a primed template) → no secrets inside, yet everything authenticates → the agent fixes and commits alone → git fetch, review the diff, cherry-pick → isx destroy.
-->

---

## Others are working on <span class="accent">the same problem</span>

<div class="cards three equal mt-4">
  <div class="card warn"><h4>Docker Sandboxes</h4><p>The closest: a microVM per agent on your machine, and a host-side proxy that adds API keys to requests. Your working tree is mounted in, read-write by default.</p></div>
  <div class="card warn"><h4>Process sandboxes</h4><p>Claude Code's sandbox, Anthropic's srt, Nono, Lince. They confine the agent's commands on your laptop, next to your files and tools, rather than giving it a machine.</p></div>
  <div class="card warn"><h4>Cloud sandboxes</h4><p>Anthropic's cloud sessions, E2B, Daytona. A machine per agent, on someone else's compute and account.</p></div>
</div>

<p class="lead mt-6">Where isx differs: a whole Linux machine, <span class="accent">branched in seconds</span> from a template you wrote, handing back <span class="accent">a commit</span> rather than editing a mount. On your hardware, for any agent.</p>

<!--
On Docker Sandboxes, point at "read-write by default" and let the room remember the USB stick; no need to say more. (Docker also offers a clone mode and a mountless mode; say so if asked.)
Not a ranking, and not a takedown: the point is that isolating agents is now a recognised problem, and the credential proxy in particular is not unique to isx. Docker Sandboxes is the one close match; the other two are different kinds of isolation.
What the others don't do: branch the whole machine by copy-on-write from a template (or from a running machine: its disk, not its memory), templates as reviewed YAML, and a git remote instead of a mount.
If asked about others: container-use (Dagger; a container and a git branch per agent, via MCP; experimental) and Sculptor (Imbue; a Mac app running Claude Code or Codex agents in Docker containers) also isolate agents, with different trade-offs.
Cloud sessions detail, if asked: an Anthropic-managed VM, an egress allowlist, and a proxy that holds your GitHub token outside it; a paid subscription, and usually a GitHub account.
Sources: docs.docker.com/ai/sandboxes/security ("The raw credential values never enter the VM"; "A direct mount is read-write"); code.claude.com/docs/en/sandbox-environments; github.com/anthropic-experimental/sandbox-runtime (srt); Nono (helpnetsecurity.com, 2026-07-27); lince.sh (Bubblewrap-based); github.com/dagger/container-use; imbue.com/sculptor. Re-check each wording against its current docs before presenting.
-->

---
layout: center
class: glow-accent
---

<h1 class="statement">Local-first, <span class="accent">by conviction</span></h1>

<p class="lead mt-8 muted">Your hardware. Your network. Your repos.</p>

<p class="lead mt-6">The cheapest machine is <span class="accent">the one you already own</span>.<br>Light enough to run multiple agents on it.</p>

<!--
The cost point, said plainly: no per-minute cloud meter and no subscription for the machines; isx is open source, and a branch shares its template's disk and reserves no RAM up front, so a laptop holds several. How many depends on the workload and the RAM; don't quote a number without measuring it. Be honest if asked: the model's tokens still cost what they cost; isx doesn't change that.
-->

---

## Get started

<div class="cards mt-2">
  <div class="card"><h4>Fedora / RHEL</h4><div class="cmd small">sudo dnf copr enable sanne/incus-spawn<br>sudo dnf install incus-spawn</div></div>
  <div class="card"><h4>macOS</h4><div class="cmd small">brew install Sanne/tap/incus-spawn</div></div>
  <div class="card"><h4>Any Linux</h4><div class="cmd small">curl -fsSL https://isx.run | sh</div></div>
  <div class="card"><h4>Already have a JVM?</h4><div class="cmd small">jbang app install isx@Sanne/incus-spawn</div></div>
</div>

<div class="card mt-2"><h4>Ubuntu / Debian</h4><div class="cmd small">curl -fsSL https://sanne.github.io/isx-apt-releases/public.gpg \<br>&nbsp;&nbsp;| sudo gpg --yes --dearmor -o /usr/share/keyrings/incus-spawn.gpg<br>echo "deb [signed-by=/usr/share/keyrings/incus-spawn.gpg] https://sanne.github.io/isx-apt-releases stable main" \<br>&nbsp;&nbsp;| sudo tee /etc/apt/sources.list.d/incus-spawn.list<br>sudo apt update && sudo apt install incus-spawn</div></div>

<p class="note pin">On macOS, isx runs its own small Linux VM: no Docker Desktop. Full instructions at <a class="kw" href="https://isx.run">isx.run</a>.</p>

<!--
Commands from the isx README (Installation). Debian/Ubuntu updates come with apt upgrade; Fedora with dnf.
-->

---

## Then: <span class="accent">isx init</span>

<p class="lead">One command, interactive: it installs Incus (on macOS, the Linux VM), creates the storage pool, asks for your credentials, and sets up the proxy.</p>

<div class="cmd hero mt-6">isx init</div>

<div class="cards mt-6">
  <div class="card"><h4>Then drive it from the CLI</h4><div class="cmd">isx build tpl-java<br>isx branch my-feature --from tpl-java</div></div>
  <div class="card"><h4>Or live in the TUI</h4><div class="cmd">isx</div><p>No arguments needed.</p></div>
</div>

<!--
Per the isx README: on Linux, isx init installs Incus through your package manager and creates a btrfs pool if needed; on macOS it provisions the vfkit VM. It prompts for the credentials the proxy will inject, and can install the proxy as a systemd user service (launchd on macOS). The real keys stay in ~/.config/incus-spawn/ on the host.
-->

---

## Built on <span class="accent">great open source</span>

<div class="cards three mt-4 built-on">
  <div class="card"><div class="tech"><a href="https://linuxcontainers.org/incus/"><img src="/logos/incus.png" alt="Incus" class="mark"></a><span><a href="https://linuxcontainers.org/incus/">Incus</a></span></div><p>System containers and VMs: the machines themselves</p></div>
  <div class="card"><div class="tech"><a href="https://quarkus.io/"><img src="/logos/quarkus.svg" alt="Quarkus" class="word"></a></div><p>The framework isx is written with</p></div>
  <div class="card"><div class="tech"><a href="https://www.graalvm.org/"><img src="/logos/graalvm.png" alt="GraalVM" class="word"></a></div><p>Native binaries: instant startup, no JVM to install</p></div>
  <div class="card"><div class="tech"><img src="/logos/java.svg" alt="Java" class="mark"><span>Java 25</span></div><p>The language, on the current LTS</p></div>
  <div class="card"><div class="tech"><img src="/logos/tamboui.svg" alt="Tamboui" class="mark"><span><a href="https://tamboui.dev/">Tamboui</a> &amp; <a href="https://github.com/aeshell/aesh">Aesh</a></span></div><p>The terminal UI and the command engine</p></div>
</div>

<p class="note pin">Thank you to these communities: isx exists because they built the hard parts.</p>

---
layout: center
class: glow-accent
---

<h1 class="statement"><span class="accent">Their machines.</span><br>Your machine.</h1>

<p class="lead mt-10">Questions?</p>

<div class="ask mt-4">
  <a class="site" href="https://isx.run" target="_blank">isx.run</a>
  <span class="or">or, later</span>
  <span class="kw">isx ask "how do I set up a template for my repo?"</span>
</div>

<!--
isx ask answers questions about isx itself, from its own documentation, using the AI account you configured (it spends tokens). Also reachable as ? in the TUI.
-->

---
layout: center
class: divider
---

<div class="ghost">+</div>

# Backup

<p>For questions</p>

---

## Can't we just use <span class="muted">Docker?</span>

<table class="mt-2">
  <thead><tr><th>Capability</th><th>Docker / Podman</th><th>isx</th></tr></thead>
  <tbody>
    <tr><td>Init system (systemd)</td><td class="warn">Not in Docker by default; Podman supports it</td><td class="accent">Every machine boots one</td></tr>
    <tr><td>Nested containers (Testcontainers, compose)</td><td class="warn">Needs <span class="kw">--privileged</span> or extra setup</td><td class="accent">Work out of the box</td></tr>
    <tr><td>Profilers (perf)</td><td class="warn">Blocked by the default seccomp profile</td><td class="accent">Work</td></tr>
    <tr><td>Branch a whole environment</td><td class="warn">Commit it to a new image</td><td class="accent"><span class="kw">isx branch</span>: a CoW clone in seconds</td></tr>
    <tr><td>Credential isolation</td><td class="warn">Up to you</td><td class="accent">Built in: real keys never enter</td></tr>
  </tbody>
</table>

<p class="note pin">Docker can be configured to do most of this. It's built for shipping apps, so a workstation isn't its default; isx makes a complete dev machine the default.</p>

---

## Or a <span class="muted">VM</span> per agent?

<table class="mt-2">
  <thead><tr><th></th><th>A full VM</th><th>isx container</th></tr></thead>
  <tbody>
    <tr><td>Startup</td><td class="warn">Boots its own kernel: seconds</td><td class="accent">Shares the host kernel: near-instant</td></tr>
    <tr><td>Memory</td><td class="warn">Guess up front. Too low: the build dies. Too high: that RAM is set aside for one guest, whose kernel fills it with its own cache, so fewer fit and your laptop has less slack</td><td class="accent">One kernel manages all of it: idle machines cost little, and cache, swap and priorities are shared across every machine</td></tr>
    <tr><td>Cost per instance</td><td class="warn">A guest kernel and firmware</td><td class="accent">Just the processes</td></tr>
    <tr><td>Isolation boundary</td><td class="accent">Separate kernel: stronger</td><td class="warn">Shared kernel</td></tr>
  </tbody>
</table>

<p class="note pin">The last row is the honest one. isx runs both, one flag apart: <span class="kw">--type vm</span> when you want it. The container is the default because it's cheap enough to branch per task.</p>
