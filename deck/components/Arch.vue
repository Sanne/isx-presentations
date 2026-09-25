<script setup lang="ts">
// isx's architecture, one path per click. Same layout for both platforms so
// the macOS slide reads as "the same thing, inside an appliance VM".
//  platform="linux" (clicks: 3): control path → traffic path → git path
//  platform="macos" (clicks: 3): control path over vsock → traffic path to
//    the proxy on the Mac → the control channel to the in-VM agent
// Facts from DESIGN.md (Incus Daemon Connection, macOS vsock robustness,
// Auth & Security) and appliance/DESIGN.md (Boot Backends, First-Boot).
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = defineProps<{ platform: 'linux' | 'macos' }>()
const { $clicks } = useSlideContext()
const step = computed(() => $clicks.value)
const mac = computed(() => props.platform === 'macos')

type Box = { x: number; y: number; w: number; h: number; title: string; sub?: string[]; kind?: string }

const linuxBoxes: Box[] = [
  { x: 30, y: 60, w: 230, h: 66, title: 'isx', sub: ['TUI and CLI'] },
  { x: 30, y: 160, w: 230, h: 66, title: 'git fetch agent-1', sub: ['git-remote-isx'] },
  { x: 30, y: 318, w: 230, h: 104, title: 'isx-proxy', sub: ['systemd service', 'holds the credentials'], kind: 'proxy' },
  { x: 340, y: 60, w: 200, h: 66, title: 'Incus daemon', sub: ['incusd'] },
  { x: 340, y: 318, w: 790, h: 60, title: 'incusbr0 bridge', sub: ['dnsmasq: api.anthropic.com → gateway · iptables :443 → proxy'], kind: 'bridge' },
]
const macBoxes: Box[] = [
  { x: 30, y: 60, w: 230, h: 66, title: 'isx', sub: ['TUI and CLI'] },
  { x: 30, y: 160, w: 230, h: 76, title: 'vfkit', sub: ['Apple Virtualization', 'framework'] },
  { x: 30, y: 318, w: 230, h: 104, title: 'isx-proxy', sub: ['launchd service', 'holds the credentials'], kind: 'proxy' },
  { x: 350, y: 112, w: 210, h: 60, title: 'socat', sub: ['vsock :8443 → Incus'] },
  { x: 350, y: 188, w: 210, h: 60, title: 'isx-agent', sub: ['vsock :1025 · fixed verbs'] },
  { x: 590, y: 112, w: 200, h: 60, title: 'Incus daemon', sub: ['incusd'] },
  { x: 350, y: 330, w: 760, h: 56, title: 'incusbr0 bridge', sub: ['dnsmasq overrides · DNAT :443 → the Mac, :18443'], kind: 'bridge' },
]
const boxes = computed(() => (mac.value ? macBoxes : linuxBoxes))

// Where the machines live: the btrfs pool (Linux) or the VM's data disk.
const pool = computed(() => mac.value
  ? { x: 820, y: 104, w: 290, h: 200, label: 'btrfs data disk' }
  : { x: 620, y: 44, w: 510, h: 240, label: 'btrfs pool "cow"' })
const machines = computed(() => {
  const p = pool.value
  // The Mac's disk panel is narrower, so it shows two machines, not three.
  const names = mac.value ? ['agent-1', 'agent-2'] : ['agent-1', 'agent-2', 'agent-3']
  const n = names.length, gap = 12, w = (p.w - 40 - gap * (n - 1)) / n
  return names.map((name, i) => ({ name, x: p.x + 20 + i * (w + gap), y: p.y + p.h - 100, w, h: 80 }))
})
const tpl = computed(() => ({ x: pool.value.x + 20, y: pool.value.y + 42, w: pool.value.w - 40, h: 48 }))

// Paths: [d, label x, label y, label, step]
const paths = computed(() => mac.value ? [
  ['M145 126 L145 160', 158, 147, 'vm.incus.sock', 1],
  ['M260 180 C 300 180, 310 142, 350 142', 305, 132, 'virtio-vsock', 1],
  ['M560 142 L590 142', 0, 0, '', 1],
  ['M790 142 L820 142', 0, 0, '', 1],
  [`M${machines.value[1].x + machines.value[1].w / 2} 304 L${machines.value[1].x + machines.value[1].w / 2} 330`, 0, 0, '', 2],
  ['M350 372 C 310 372, 300 380, 260 380', 305, 402, 'to the Mac :18443', 2],
  ['M145 422 L145 468', 158, 450, 'real credentials added', 2],
  ['M260 222 C 300 222, 310 218, 350 218', 305, 238, 'vsock :1025', 3],
] : [
  ['M260 93 L340 93', 300, 83, 'REST, unix socket', 1],
  ['M540 93 L620 93', 580, 83, 'CoW-copy, start', 1],
  [`M${machines.value[1].x + machines.value[1].w / 2} 284 L${machines.value[1].x + machines.value[1].w / 2} 318`, 0, 0, '', 2],
  ['M340 350 C 300 350, 300 370, 260 370', 300, 395, 'redirect :443', 2],
  ['M145 422 L145 468', 158, 450, 'real credentials added', 2],
  ['M260 193 C 320 193, 400 160, 430 126', 330, 208, 'exec over WebSocket', 3],
  [`M540 110 C 580 150, ${machines.value[0].x} 200, ${machines.value[0].x + 20} ${machines.value[0].y}`, 0, 0, '', 3],
])
</script>

<template>
  <svg class="arch" viewBox="0 0 1160 520" role="img"
       :aria-label="mac
         ? 'On macOS, isx runs Incus inside an appliance VM started by vfkit. The CLI reaches Incus over vsock through socat; containers reach the proxy on the Mac through a DNAT rule; a separate vsock channel reaches a small in-VM agent with a fixed set of verbs.'
         : 'On Linux, isx talks to the Incus daemon over its unix socket; machines live on a btrfs pool; their HTTPS traffic is redirected from the bridge to isx-proxy, which adds credentials; git reaches a machine through Incus exec over a WebSocket.'">
    <rect class="host" x="1" y="1" width="1158" height="440" rx="14" />
    <text class="host-lbl" x="24" y="34">{{ mac ? 'your Mac' : 'your Linux machine' }}</text>

    <!-- the appliance VM (macOS) -->
    <g v-if="mac">
      <rect class="vm" x="330" y="44" width="800" height="360" rx="12" />
      <text class="lbl accent start" x="350" y="76">isx appliance VM</text>
      <text class="sub" x="350" y="98">Alpine · custom kernel, no initrd · headless · no Docker Desktop</text>
    </g>

    <!-- the pool of machines -->
    <rect class="pool" :x="pool.x" :y="pool.y" :width="pool.w" :height="pool.h" rx="10" />
    <text class="sub" :x="pool.x + 16" :y="pool.y + 26">{{ pool.label }}</text>
    <rect class="tpl" :x="tpl.x" :y="tpl.y" :width="tpl.w" :height="tpl.h" rx="8" />
    <text class="lbl sm" :x="tpl.x + tpl.w / 2" :y="tpl.y + 30">tpl-java · template</text>
    <g v-for="m in machines" :key="m.name">
      <rect class="machine" :x="m.x" :y="m.y" :width="m.w" :height="m.h" rx="8" />
      <text class="lbl sm" :x="m.x + m.w / 2" :y="m.y + 34">{{ m.name }}</text>
      <text class="sub mid" :x="m.x + m.w / 2" :y="m.y + 58">CoW branch</text>
    </g>

    <!-- components -->
    <g v-for="b in boxes" :key="b.title">
      <rect class="comp" :class="b.kind" :x="b.x" :y="b.y" :width="b.w" :height="b.h" rx="8" />
      <text class="lbl sm" :x="b.x + b.w / 2" :y="b.y + 26">{{ b.title }}</text>
      <text v-for="(s, i) in b.sub" :key="s" class="sub mid" :x="b.x + b.w / 2" :y="b.y + 48 + i * 20">{{ s }}</text>
    </g>

    <!-- the internet -->
    <rect class="net" x="30" y="468" width="1100" height="44" rx="8" />
    <text class="sub mid" x="580" y="495">api.anthropic.com · github.com · Maven Central · …</text>

    <!-- paths, one group per click -->
    <g v-for="(p, i) in paths" :key="i" class="reveal" :class="{ on: step >= (p[4] as number) }">
      <path class="wire" :class="`w${p[4]}`" :d="(p[0] as string)" />
      <text v-if="p[3]" class="wire-lbl" :x="(p[1] as number)" :y="(p[2] as number)">{{ p[3] }}</text>
    </g>

    <!-- the point of each path -->
    <text v-if="mac" class="callout reveal" :class="{ on: step >= 1 }" x="350" y="304">AF_VSOCK, not TCP: VPN socket filters can't block it</text>
    <text v-if="mac" class="callout reveal" :class="{ on: step >= 3 }" x="350" y="276">tunnel recovery, isx doctor, and pool usage for the TUI</text>
  </svg>
</template>

<style scoped>
.arch { width: 100%; height: auto; display: block; }
.arch text { font-family: 'Inter', system-ui, sans-serif; }
.host { fill: none; stroke: var(--line); stroke-width: 2; stroke-dasharray: 8 6; }
.host-lbl { font-family: 'JetBrains Mono', monospace !important; font-size: 15px; fill: var(--text-muted); }
.vm { fill: rgba(34, 211, 238, 0.04); stroke: var(--accent-edge); stroke-width: 2; }
.pool { fill: var(--surface); stroke: var(--line); stroke-width: 1.5; }
.tpl { fill: var(--surface-2); stroke: var(--line); }
.machine { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2; }
.comp { fill: var(--surface-2); stroke: var(--text-muted); stroke-width: 1.5; }
.comp.proxy { stroke: var(--accent); }
.comp.bridge { fill: var(--surface); stroke: var(--line); }
.net { fill: none; stroke: var(--line); stroke-dasharray: 4 4; }

.lbl { font-size: 20px; font-weight: 600; fill: var(--text); text-anchor: middle; }
.lbl.sm { font-size: 17px; }
.lbl.accent { fill: var(--accent); }
.lbl.start { text-anchor: start; }
.sub { font-family: 'JetBrains Mono', monospace !important; font-size: 13px; fill: var(--text-muted); }
.mid { text-anchor: middle; }

.wire { fill: none; stroke: var(--accent); stroke-width: 3; stroke-dasharray: 10 7; animation: march .7s linear infinite; }
@keyframes march { to { stroke-dashoffset: -17; } }
.wire-lbl { font-family: 'JetBrains Mono', monospace !important; font-size: 12px; fill: var(--accent); text-anchor: middle; }
.callout { font-size: 15px; fill: var(--accent); font-weight: 600; }

.reveal { opacity: 0; transition: opacity .5s; }
.reveal.on { opacity: 1; }
</style>
