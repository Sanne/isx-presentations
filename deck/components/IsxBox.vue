<script setup lang="ts">
// Introduces the isx machine, one click at a time: your laptop (the host,
// drawn as the outer frame) and your own user account on it; a machine
// appears beside your account, inside its container boundary; the agent
// inside can do anything to it; the network boundary the host enforces
// around it, what can't cross, and the one way a credential gets added (the
// proxy); and what happens when it breaks it.
// Accuracy: in the default network mode the machine reaches the internet
// directly too (NAT); only intercepted domains go through the proxy, and
// only --proxy-only makes the proxy the sole way out (design/network.md).
// Slide: clicks: 4
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()
const step = computed(() => $clicks.value)

const yours = ['~/src  (your repos)', '~/.ssh  (your keys)', '$GH_TOKEN, API keys', '~/Documents']
const can = [
  'sudo dnf install anything',
  'systemctl start postgresql',
  'podman run … (Testcontainers)',
  'rm -rf ~/  (its own home)',
]
</script>

<template>
  <svg class="box" viewBox="0 0 1160 560" role="img"
       aria-label="Your laptop runs your user account (your home and the isx proxy) and an isx machine. The machine sits inside a container boundary, and inside a network boundary the host's firewall enforces. Your files and secrets don't cross. HTTPS to an intercepted domain carries only a proof; the proxy checks it, adds the real key, and sends it on to the internet.">
    <!-- the host: everything in this frame runs on your laptop -->
    <rect class="host" x="2" y="22" width="1156" height="470" rx="16" />
    <rect class="host-tab" x="24" y="6" width="540" height="34" rx="8" />
    <text class="host-lbl" x="40" y="30">YOUR LAPTOP <tspan class="host-sub"> · the host: everything in this frame runs on it</tspan></text>

    <!-- your user account: your things, and the proxy that runs as you -->
    <rect class="account" x="22" y="56" width="300" height="416" rx="12" />
    <text class="acct-lbl" x="40" y="84">your user account</text>
    <rect class="panel" x="40" y="100" width="264" height="200" rx="10" />
    <text class="lbl" x="58" y="134">your home</text>
    <text v-for="(y, i) in yours" :key="y" class="mono" x="58" :y="168 + i * 32">{{ y }}</text>
    <rect class="panel proxy" :class="{ lit: step >= 3 }" x="40" y="318" width="264" height="138" rx="10" />
    <text class="lbl" x="58" y="350">isx proxy</text>
    <text class="sub" x="58" y="378">holds the real credentials</text>
    <g class="reveal" :class="{ on: step >= 3 }">
      <text class="sub accent" x="58" y="406">① checks the proof</text>
      <text class="sub accent" x="58" y="432">② adds the real key</text>
    </g>

    <!-- the network boundary: the host's firewall, outside the machine -->
    <g class="reveal" :class="{ on: step >= 3 }">
      <rect class="fw" x="420" y="50" width="720" height="424" rx="16" />
      <rect class="fw-tab" x="440" y="38" width="600" height="26" rx="6" />
      <text class="fw-lbl" x="454" y="56">NETWORK BOUNDARY <tspan class="fw-sub"> · the host's firewall, out of the machine's reach</tspan></text>
    </g>

    <!-- the isx machine, inside its container boundary -->
    <g class="reveal" :class="{ on: step >= 1 }">
      <rect class="machine" :class="{ broken: step >= 4 }" x="456" y="84" width="664" height="372" rx="12" />
      <text class="ct-lbl" x="476" y="108">CONTAINER BOUNDARY <tspan class="ct-sub"> · unprivileged: root inside is no one on your laptop</tspan></text>
      <text class="lbl accent" x="476" y="144">agent-1 · an isx machine</text>
      <text class="what" x="476" y="172">A system container: a full Linux distribution (Fedora)</text>
      <text class="sub" x="476" y="222">its own filesystem</text>
      <text class="sub" x="476" y="250">its own init (systemd)</text>
      <text class="sub" x="476" y="278">its own network and IP</text>
      <text class="sub" x="476" y="306">its own process tree</text>

      <!-- agentuser, having fun -->
      <g class="reveal" :class="{ on: step >= 2 }">
        <circle class="avatar" cx="760" cy="218" r="22" />
        <text class="avatar-glyph" x="760" y="226">a</text>
        <text class="lbl" x="796" y="214">agentuser</text>
        <text class="sub accent" x="796" y="238">passwordless sudo</text>
        <text v-for="(c, i) in can" :key="c" class="mono can" x="740" :y="282 + i * 32">
          <tspan class="ok">✓</tspan>  {{ c }}
        </text>
      </g>

      <text class="caption reveal" :class="{ on: step >= 4 }" x="476" y="432">
        Broke it? <tspan class="accent">isx destroy</tspan>, and branch a fresh one in seconds.
      </text>
    </g>

    <!-- what can't cross, and the one way a credential gets added -->
    <g class="reveal" :class="{ on: step >= 3 }">
      <line class="blocked" x1="456" y1="200" x2="326" y2="200" />
      <text class="x" x="378" y="192">✗</text>
      <text class="tiny" x="378" y="222">no secrets</text>
      <line class="blocked" x1="456" y1="270" x2="326" y2="270" />
      <text class="x" x="378" y="262">✗</text>
      <text class="tiny" x="378" y="292">not mounted</text>

      <line class="allowed" x1="456" y1="372" x2="310" y2="372" />
      <path class="head" d="M308 372 l10 -6 v12 z" />
      <text class="tiny accent" x="378" y="362">HTTPS</text>
      <text class="tiny" x="378" y="392">a proof,</text>
      <text class="tiny" x="378" y="406">not a key</text>

      <!-- out of the laptop, with the real key -->
      <line class="allowed" x1="172" y1="456" x2="172" y2="514" />
      <path class="head" d="M172 520 l-6 -10 h12 z" />
      <text class="out" x="190" y="516">api.anthropic.com · github.com · …  <tspan class="accent">with the real key</tspan></text>
      <text class="out muted" x="190" y="542">Other hosts: straight out, with nothing to steal. With --proxy-only, nothing else.</text>
    </g>
  </svg>
</template>

<style scoped>
.box { width: 100%; height: auto; display: block; }
.box text { font-family: 'Inter', system-ui, sans-serif; }

.host { fill: rgba(139, 152, 176, .04); stroke: var(--text-muted); stroke-width: 2.5; }
.host-tab { fill: var(--bg); stroke: var(--text-muted); stroke-width: 2; }
.host-lbl { font-size: 17px; font-weight: 700; letter-spacing: .08em; fill: var(--text); }
.host-sub { font-weight: 400; letter-spacing: 0; fill: var(--text-muted); }
.account { fill: none; stroke: var(--line); stroke-width: 1.5; stroke-dasharray: 6 5; }
.acct-lbl { font-family: 'JetBrains Mono', monospace !important; font-size: 14px; fill: var(--text-muted); }
.panel { fill: var(--surface); stroke: var(--line); stroke-width: 1.5; }
.panel.proxy { stroke: var(--accent-edge); transition: stroke .5s, filter .5s; }
.panel.proxy.lit { stroke: var(--accent); filter: drop-shadow(0 0 12px rgba(34, 211, 238, .35)); }

.fw { fill: rgba(245, 166, 35, .03); stroke: var(--warn); stroke-width: 2; stroke-dasharray: 10 6; }
.fw-tab { fill: var(--bg); stroke: var(--warn); stroke-width: 1.5; }
.fw-lbl { font-size: 14px; font-weight: 700; letter-spacing: .08em; fill: var(--warn); }
.fw-sub { font-weight: 400; letter-spacing: 0; fill: var(--text-muted); }

.machine { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2.5; filter: drop-shadow(0 0 14px rgba(34, 211, 238, .35)); transition: stroke .5s, filter .5s; }
.machine.broken { stroke: var(--danger); filter: drop-shadow(0 0 14px rgba(255, 77, 109, .35)); }
.ct-lbl { font-size: 14px; font-weight: 700; letter-spacing: .08em; fill: var(--accent); }
.ct-sub { font-weight: 400; letter-spacing: 0; fill: var(--text-muted); }

.lbl { font-size: 21px; font-weight: 600; fill: var(--text); }
.sub { font-size: 16px; fill: var(--text-muted); }
.mono { font-family: 'JetBrains Mono', monospace !important; font-size: 16px; fill: var(--text); white-space: pre; }
.accent { fill: var(--accent); }
.ok { fill: var(--accent); }
.can { fill: var(--text); }

.avatar { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 2; }
.avatar-glyph { font-size: 22px; font-weight: 700; fill: var(--accent); text-anchor: middle; }

.blocked { stroke: var(--danger); stroke-width: 2.5; stroke-dasharray: 6 6; }
.allowed { stroke: var(--accent); stroke-width: 2.5; }
.head { fill: var(--accent); }
.x { font-size: 24px; font-weight: 700; fill: var(--danger); text-anchor: middle; }
.tiny { font-size: 14px; fill: var(--text-muted); text-anchor: middle; }
.tiny.accent { fill: var(--accent); }
.out { font-size: 16px; fill: var(--text); }
.out.muted { font-size: 14px; fill: var(--text-muted); }
.caption { font-size: 18px; fill: var(--text); }
.what { font-size: 17px; fill: var(--text); }

.reveal { opacity: 0; transition: opacity .5s; }
.reveal.on { opacity: 1; }
</style>
