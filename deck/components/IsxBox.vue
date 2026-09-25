<script setup lang="ts">
// Introduces the isx machine, one click at a time: your laptop (the host,
// drawn as the outer frame) and your own user account on it; a machine
// appears beside your account, on the same laptop; the agent inside can do anything
// to it; what it can't reach; and what happens when it breaks it.
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
  <svg class="box" viewBox="0 0 1160 500" role="img"
       aria-label="Your laptop, the host, runs both your own user account (your home directory and the isx proxy) and an isx machine. Inside the machine, agentuser has passwordless sudo over its own machine, but your files and credentials are not in it.">
    <!-- the host: everything on this slide runs on your laptop -->
    <rect class="host" x="2" y="22" width="1156" height="474" rx="16" />
    <rect class="host-tab" x="24" y="6" width="540" height="34" rx="8" />
    <text class="host-lbl" x="40" y="30">YOUR LAPTOP <tspan class="host-sub"> · the host: everything in this frame runs on it</tspan></text>

    <!-- your user account: your things, and the proxy that runs as you -->
    <rect class="account" x="22" y="56" width="318" height="420" rx="12" />
    <text class="acct-lbl" x="40" y="84">your user account</text>
    <rect class="panel" x="40" y="100" width="282" height="214" rx="10" />
    <text class="lbl" x="58" y="134">your home</text>
    <text v-for="(y, i) in yours" :key="y" class="mono" x="58" :y="170 + i * 36">{{ y }}</text>
    <rect class="panel proxy" x="40" y="332" width="282" height="126" rx="10" />
    <text class="lbl" x="58" y="366">isx proxy</text>
    <text class="sub" x="58" y="396">holds the real credentials</text>
    <text class="sub" x="58" y="422">adds them to outgoing requests</text>

    <!-- the isx machine -->
    <g class="reveal" :class="{ on: step >= 1 }">
      <rect class="machine" :class="{ broken: step >= 4 }" x="430" y="56" width="706" height="420" rx="12" />
      <text class="lbl accent" x="456" y="92">agent-1 · an isx machine</text>
      <text class="what" x="456" y="124">A system container: a full Linux distribution (Fedora), isolated from your account</text>
      <text class="sub" x="456" y="196">its own filesystem</text>
      <text class="sub" x="456" y="224">its own init (systemd)</text>
      <text class="sub" x="456" y="252">its own network and IP</text>
      <text class="sub" x="456" y="280">its own process tree</text>

      <!-- agentuser, having fun -->
      <g class="reveal" :class="{ on: step >= 2 }">
        <circle class="avatar" cx="740" cy="192" r="22" />
        <text class="avatar-glyph" x="740" y="200">a</text>
        <text class="lbl" x="776" y="188">agentuser</text>
        <text class="sub accent" x="776" y="212">passwordless sudo</text>
        <text v-for="(c, i) in can" :key="c" class="mono can" x="720" :y="260 + i * 34">
          <tspan class="ok">✓</tspan>  {{ c }}
        </text>
      </g>

      <text class="caption reveal" :class="{ on: step >= 4 }" x="456" y="450">
        Broke it? <tspan class="accent">isx destroy</tspan>, and branch a fresh one in seconds.
      </text>
    </g>

    <!-- what it can't reach, and the one way out -->
    <g class="reveal" :class="{ on: step >= 3 }">
      <line class="blocked" x1="430" y1="200" x2="344" y2="200" />
      <text class="x" x="386" y="192">✗</text>
      <text class="tiny" x="386" y="226">no secrets</text>
      <line class="blocked" x1="430" y1="274" x2="344" y2="274" />
      <text class="x" x="386" y="266">✗</text>
      <text class="tiny" x="386" y="300">not mounted</text>
      <line class="allowed" x1="430" y1="394" x2="344" y2="394" />
      <text class="tiny accent" x="386" y="384">HTTPS</text>
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
.panel.proxy { stroke: var(--accent-edge); }

.machine { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2.5; filter: drop-shadow(0 0 14px rgba(34, 211, 238, .35)); transition: stroke .5s, filter .5s; }
.machine.broken { stroke: var(--danger); filter: drop-shadow(0 0 14px rgba(255, 77, 109, .35)); }

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
.x { font-size: 24px; font-weight: 700; fill: var(--danger); text-anchor: middle; }
.tiny { font-size: 13px; fill: var(--text-muted); text-anchor: middle; }
.tiny.accent { fill: var(--accent); }
.caption { font-size: 18px; fill: var(--text); }
.what { font-size: 17px; fill: var(--text); }

.reveal { opacity: 0; transition: opacity .5s; }
.reveal.on { opacity: 1; }
</style>
