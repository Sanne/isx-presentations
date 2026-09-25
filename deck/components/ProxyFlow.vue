<script setup lang="ts">
// The credential proxy, one click per mechanism. Plain SVG + CSS
// transitions driven by Slidev's click counter, so it steps with the
// talk, exports to PDF at every step, and shares the deck's tokens.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()
const step = computed(() => $clicks.value)

// Where the token chip sits at each step (centre, in viewBox units).
const chipAt = computed(() => {
  if (step.value < 2) return { x: 335, y: 150 }
  if (step.value < 4) return { x: 580, y: 104 }
  return { x: 822, y: 150 }
})
const real = computed(() => step.value >= 3)
</script>

<template>
  <svg class="flow" viewBox="0 0 1160 330" role="img"
       aria-label="A request leaves the container with a placeholder token; DNS and a redirect send it to the host proxy, which terminates TLS, swaps in the real key and re-encrypts to the upstream API.">
    <!-- container -->
    <rect class="bx" :class="real ? 'edge-accent' : 'edge-danger'" x="1" y="100" width="230" height="100" />
    <text class="lbl" x="116" y="142">Container</text>
    <text class="sub" x="116" y="170">the agent and its tools</text>

    <!-- wire 1 -->
    <line class="wire" :class="{ live: step <= 1 }" x1="231" y1="150" x2="445" y2="150" />
    <g class="annot" :class="{ on: step >= 1 }">
      <text class="mono" y="238"><tspan x="1" class="num">dnsmasq</tspan><tspan x="84">api.anthropic.com → gateway</tspan></text>
      <text class="mono" y="262"><tspan x="1" class="num">iptables</tspan><tspan x="84">:443 → :18443</tspan></text>
    </g>

    <!-- proxy -->
    <rect class="bx edge-accent" :class="{ lit: step >= 2 && step < 4 }" x="445" y="30" width="270" height="250" />
    <text class="lbl" x="580" y="64">Host-side proxy</text>
    <text class="step" :class="{ on: step >= 2 }" x="470" y="184"><tspan class="num">1</tspan>  terminates TLS</text>
    <text class="step" :class="{ on: step >= 3 }" x="470" y="216"><tspan class="num">2</tspan>  swaps in the real key</text>
    <text class="step" :class="{ on: step >= 4 }" x="470" y="248"><tspan class="num">3</tspan>  re-encrypts upstream</text>

    <!-- wire 2 -->
    <line class="wire" :class="{ live: step >= 4 }" x1="715" y1="150" x2="929" y2="150" />

    <!-- upstream -->
    <rect class="bx edge-line" :class="{ arrived: step >= 4 }" x="929" y="100" width="230" height="100" />
    <text class="lbl" x="1044" y="142">Upstream API</text>
    <text class="sub" x="1044" y="170">api.anthropic.com</text>

    <!-- the token, in transit -->
    <g class="chip" :style="{ transform: `translate(${chipAt.x}px, ${chipAt.y}px)` }">
      <rect :class="real ? 'edge-accent' : 'edge-danger'" x="-92" y="-17" width="184" height="34" rx="6" />
      <text class="tok fake" :class="{ gone: real }" y="6">sk-ant-placeholder</text>
      <text class="tok real" :class="{ gone: !real }" y="6">sk-ant-api03-R7f…</text>
    </g>

    <!-- the point -->
    <g class="annot" :class="{ on: step >= 5 }">
      <text class="cap accent" x="116" y="318">no real credential here</text>
      <text class="cap" x="580" y="318">the real key lives on the host</text>
    </g>
  </svg>
</template>

<style scoped>
.flow { width: 100%; height: auto; display: block; overflow: visible; }
.flow text { font-family: 'Inter', system-ui, sans-serif; }

.bx { fill: var(--surface-2); stroke-width: 2; rx: 10; transition: stroke .4s, fill .4s, filter .4s; }
.edge-accent { stroke: var(--accent); }
.edge-danger { stroke: var(--danger); }
.edge-line   { stroke: var(--line); }
.bx.lit      { filter: drop-shadow(0 0 14px rgba(34, 211, 238, .45)); }
.bx.arrived  { stroke: var(--accent); }

.lbl { font-size: 20px; font-weight: 600; fill: var(--text); text-anchor: middle; }
.sub, .mono, .step, .tok { font-family: 'JetBrains Mono', monospace; }
.sub  { font-size: 14px; fill: var(--text-muted); text-anchor: middle; }
.mono { font-size: 14px; fill: var(--text-muted); }
.cap  { font-size: 16px; fill: var(--text-muted); text-anchor: middle; }
.cap.accent { fill: var(--accent); }

.step { font-size: 15px; fill: var(--text-muted); opacity: .35; transition: opacity .4s, fill .4s; }
.step.on { opacity: 1; fill: var(--text); }
.num { fill: var(--accent); font-weight: 700; }

.annot { opacity: 0; transition: opacity .5s; }
.annot.on { opacity: 1; }

/* Traffic on a wire: marching dashes while the request is on it. */
.wire { stroke: var(--line); stroke-width: 3; transition: stroke .4s; }
.wire.live { stroke: var(--accent); stroke-dasharray: 12 8; animation: march .6s linear infinite; }
@keyframes march { to { stroke-dashoffset: -20; } }

.chip { transition: transform .8s cubic-bezier(.65, 0, .35, 1); }
.chip rect { fill: var(--bg); stroke-width: 1.5; transition: stroke .4s; }
.tok { font-size: 15px; text-anchor: middle; transition: opacity .35s; }
.tok.fake { fill: var(--danger); }
.tok.real { fill: var(--accent); }
.tok.gone { opacity: 0; }
</style>
