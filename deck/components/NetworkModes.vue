<script setup lang="ts">
// The three network modes, the same machine and the same three requests in
// each (slide: clicks: 3, one panel per click).
// api.anthropic.com and github.com are among the hosts the proxy intercepts
// (github.com when the template has the gh tool), so they reach the internet
// through it; evil.example stands for any other host, which a machine reaches
// directly. --proxy-only is iptables inside the machine: drop all output
// except to the proxy and DNS (InstanceLifecycle.applyProxyOnlyFirewall).
// --airgap removes the network device, so no agent runs there: it couldn't
// reach its model. The third panel's machine runs only the tests.
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()

const panels = [
  { title: 'Full internet', flag: '(default)', mode: 'full', caption: 'credentials added at the proxy' },
  { title: 'Proxy only', flag: '--proxy-only', mode: 'proxy', caption: 'iptables: only the proxy and DNS' },
  { title: 'Airgapped', flag: '--airgap', mode: 'air', caption: 'no network: no agent, just the tests' },
]
const hosts = [
  { name: 'api.anthropic.com', y: 92, proxied: true },
  { name: 'github.com', y: 132, proxied: true },
  { name: 'evil.example', y: 182, proxied: false },
]
const PW = 360, GAP = 40
</script>

<template>
  <svg class="nm" viewBox="0 0 1160 250" role="img"
       aria-label="Full internet: all three requests leave, two through the proxy. Proxy only: the proxied requests leave and the other is dropped. Airgapped: the machine has no network at all.">
    <g v-for="(p, i) in panels" :key="p.mode" class="panel" :class="{ on: $clicks >= i + 1 }" :transform="`translate(${i * (PW + GAP)} 0)`">
      <rect class="frame" x="0" y="0" :width="PW" height="246" rx="12" />
      <text class="h" x="18" y="32">{{ p.title }}</text>
      <text class="flag" :x="PW - 18" y="32" text-anchor="end">{{ p.flag }}</text>

      <!-- the machine -->
      <rect class="box" x="18" y="80" width="72" height="116" rx="8" />
      <text class="sub mid" x="54" y="143">{{ p.mode === 'air' ? 'tests' : 'agent-1' }}</text>

      <template v-if="p.mode !== 'air'">
        <!-- the proxy, and what goes through it -->
        <rect class="proxy" x="112" y="86" width="60" height="60" rx="8" />
        <text class="sub mid" x="142" y="121">proxy</text>
        <path class="wire" d="M90 116 L 112 116" />
        <template v-for="h in hosts" :key="h.name">
          <path v-if="h.proxied" class="wire" :d="`M172 116 C 182 116, 178 ${h.y - 4}, 188 ${h.y - 4}`" />
          <text v-if="h.proxied" class="host" x="192" :y="h.y">{{ h.name }}</text>
        </template>
        <!-- everything else goes direct, or doesn't go at all -->
        <path class="wire" :class="{ direct: p.mode === 'full', cut: p.mode === 'proxy' }" :d="p.mode === 'full' ? 'M90 178 L 188 178' : 'M90 178 L 130 178'" />
        <text v-if="p.mode === 'proxy'" class="stop" x="134" y="185">✗</text>
        <text class="host" :class="{ blocked: p.mode === 'proxy', risky: p.mode === 'full' }" x="192" y="182">evil.example</text>
      </template>
      <template v-else>
        <text v-for="h in hosts" :key="h.name" class="host gone" x="192" :y="h.y">{{ h.name }}</text>
      </template>

      <text class="cap" x="18" y="228">{{ p.caption }}</text>
    </g>
  </svg>
</template>

<style scoped>
.nm { width: 100%; height: auto; display: block; overflow: visible; }
.nm text { font-family: 'Inter', system-ui, sans-serif; }
.h { font-size: 20px; font-weight: 700; fill: var(--text); }
.flag, .sub, .host, .cap { font-family: 'JetBrains Mono', monospace !important; }
.flag { font-size: 14px; fill: var(--accent); }
.sub { font-size: 14px; fill: var(--text); }
.mid { text-anchor: middle; }
.host { font-size: 14px; fill: var(--text); }
.host.risky { fill: var(--warn); }
.host.blocked, .host.gone { fill: var(--text-muted); opacity: .5; text-decoration: line-through; }
.cap { font-size: 13px; fill: var(--text-muted); }
.stop { font-size: 20px; font-weight: 700; fill: var(--danger); }

.frame { fill: var(--surface); stroke: var(--line); stroke-width: 1.5; }
.box { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2; }
.proxy { fill: var(--surface-2); stroke: var(--accent-edge); stroke-width: 1.5; }
.wire { fill: none; stroke: var(--accent); stroke-width: 2; stroke-dasharray: 6 5; animation: march 1s linear infinite; }
.wire.direct { stroke: var(--warn); }
.wire.cut { stroke: var(--danger); animation: none; }
@keyframes march { to { stroke-dashoffset: -11; } }

.panel { opacity: .12; transition: opacity .5s; }
.panel.on { opacity: 1; }
</style>
