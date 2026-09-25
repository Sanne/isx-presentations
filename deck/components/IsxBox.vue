<script setup lang="ts">
// Introduces the isx machine, one click at a time: your laptop and what's on
// it; a machine appears beside your things; the agent inside can do anything
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
  <svg class="box" viewBox="0 0 1160 470" role="img"
       aria-label="Your laptop holds your home directory and the isx proxy. An isx machine runs beside them; inside it, agentuser has passwordless sudo over its own machine, but your files and credentials are not in it.">
    <!-- the host -->
    <rect class="host" x="1" y="1" width="1158" height="468" rx="14" />
    <text class="host-lbl" x="24" y="34">your laptop</text>

    <!-- your things -->
    <rect class="panel" x="24" y="56" width="290" height="250" rx="10" />
    <text class="lbl" x="44" y="90">your home</text>
    <text v-for="(y, i) in yours" :key="y" class="mono" x="44" :y="128 + i * 40">{{ y }}</text>

    <!-- the proxy, holding the real credentials -->
    <rect class="panel proxy" x="24" y="330" width="290" height="112" rx="10" />
    <text class="lbl" x="44" y="366">isx proxy</text>
    <text class="sub" x="44" y="394">holds the real credentials</text>
    <text class="sub" x="44" y="418">adds them to outgoing requests</text>

    <!-- the isx machine -->
    <g class="reveal" :class="{ on: step >= 1 }">
      <rect class="machine" :class="{ broken: step >= 4 }" x="430" y="56" width="706" height="386" rx="12" />
      <text class="lbl accent" x="456" y="92">agent-1 · an isx machine</text>
      <text class="what" x="456" y="124">A system container: a full Linux distribution (Fedora), isolated from your laptop</text>
      <text class="sub" x="456" y="190">its own filesystem</text>
      <text class="sub" x="456" y="218">its own init (systemd)</text>
      <text class="sub" x="456" y="246">its own network and IP</text>
      <text class="sub" x="456" y="274">its own process tree</text>

      <!-- agentuser, having fun -->
      <g class="reveal" :class="{ on: step >= 2 }">
        <circle class="avatar" cx="740" cy="186" r="22" />
        <text class="avatar-glyph" x="740" y="194">a</text>
        <text class="lbl" x="776" y="182">agentuser</text>
        <text class="sub accent" x="776" y="206">passwordless sudo</text>
        <text v-for="(c, i) in can" :key="c" class="mono can" x="720" :y="252 + i * 34">
          <tspan class="ok">✓</tspan>  {{ c }}
        </text>
      </g>

      <text class="caption reveal" :class="{ on: step >= 4 }" x="456" y="416">
        Broke it? <tspan class="accent">isx destroy</tspan>, and branch a fresh one in seconds.
      </text>
    </g>

    <!-- what it can't reach, and the one way out -->
    <g class="reveal" :class="{ on: step >= 3 }">
      <line class="blocked" x1="430" y1="188" x2="318" y2="188" />
      <text class="x" x="374" y="180">✗</text>
      <text class="tiny" x="374" y="214">no secrets</text>
      <line class="blocked" x1="430" y1="262" x2="318" y2="262" />
      <text class="x" x="374" y="254">✗</text>
      <text class="tiny" x="374" y="288">not mounted</text>
      <line class="allowed" x1="430" y1="386" x2="318" y2="386" />
      <text class="tiny accent" x="374" y="376">HTTPS</text>
    </g>
  </svg>
</template>

<style scoped>
.box { width: 100%; height: auto; display: block; }
.box text { font-family: 'Inter', system-ui, sans-serif; }

.host { fill: none; stroke: var(--line); stroke-width: 2; stroke-dasharray: 8 6; }
.host-lbl { font-family: 'JetBrains Mono', monospace !important; font-size: 15px; fill: var(--text-muted); }
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
