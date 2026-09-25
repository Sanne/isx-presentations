<script setup lang="ts">
// Worktrees vs. isx branches, drawn on the same geometry so the second
// picture reads as a transformation of the first.
//  mode="worktrees" (clicks: 3): one .git → three checkouts → all on one
//    machine's ports, caches and tools → the collisions.
//  mode="isx" (clicks: 2): one template → three machines, each carrying its
//    own ports, caches and tools → the host underneath holds nothing shared.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = defineProps<{ mode: 'worktrees' | 'isx' }>()
const { $clicks } = useSlideContext()
const step = computed(() => $clicks.value)
const wt = computed(() => props.mode === 'worktrees')

const cols = [
  { x: 40, branch: 'main', dir: '~/src/shop' },
  { x: 420, branch: 'fix-auth', dir: '~/src/shop-wt/fix-auth' },
  { x: 800, branch: 'new-endpoint', dir: '~/src/shop-wt/new-endpoint' },
]
const W = 320
</script>

<template>
  <svg class="m" viewBox="0 0 1160 430" role="img"
       :aria-label="wt
         ? 'One git repository with three worktrees, all sharing one machine: its ports, ~/.m2, installed tools and running services.'
         : 'One template with three isx branches, each a machine with its own checkout, ports, ~/.m2, tools and services.'">
    <!-- the source: one repository, or one template -->
    <rect class="src" x="460" y="10" width="240" height="64" rx="10" />
    <text class="lbl" x="580" y="40">{{ wt ? 'one repository' : 'tpl-java' }}</text>
    <text class="sub mid" x="580" y="62">{{ wt ? '.git' : 'template' }}</text>

    <g v-for="(c, i) in cols" :key="c.branch" class="reveal" :class="{ on: step >= 1 }">
      <path class="link" :d="`M580 74 C 580 110, ${c.x + W / 2} 100, ${c.x + W / 2} 140`" />
      <rect :class="wt ? 'dir' : 'box'" :x="c.x" y="140" :width="W" :height="wt ? 86 : 196" rx="10" />
      <text class="lbl" :x="c.x + W / 2" y="174">{{ wt ? c.branch : `agent-${i + 1}` }}</text>
      <text class="sub mid" :x="c.x + W / 2" y="202">{{ wt ? c.dir : `its own checkout · ${c.branch}` }}</text>
      <!-- in isx mode, what used to be shared lives inside each box -->
      <g v-if="!wt">
        <rect class="own" :x="c.x + 18" y="226" :width="W - 36" height="88" rx="8" />
        <text class="sub mid own-t" :x="c.x + W / 2" y="258">its own ports · ~/.m2</text>
        <text class="sub mid own-t" :x="c.x + W / 2" y="286">tools · services · IP</text>
      </g>
      <!-- in worktree mode, every checkout drops into the same machine -->
      <path v-if="wt" class="down reveal" :class="{ on: step >= 2 }" :d="`M${c.x + W / 2} 226 L ${c.x + W / 2} 300`" />
      <text v-if="wt" class="clash reveal" :class="{ on: step >= 3 }" :x="c.x + W / 2" y="276">{{ [':5432', ':5432 ✗', 'SNAPSHOT ✗'][i] }}</text>
    </g>

    <!-- the ground: one shared machine, or a host that holds nothing shared -->
    <g class="reveal" :class="{ on: step >= 2 }">
      <template v-if="wt">
        <rect class="shared" x="40" y="300" width="1080" height="110" rx="10" />
        <text class="lbl warn" x="580" y="342">one machine, shared by all three</text>
        <text class="sub mid" x="580" y="376">ports · ~/.m2 · installed tools · running services · yesterday's leftovers</text>
      </template>
      <template v-else>
        <rect class="host" x="40" y="352" width="1080" height="58" rx="10" />
        <text class="sub mid" x="580" y="387">the host underneath: nothing shared but the kernel</text>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.m { width: 100%; height: auto; display: block; }
.m text { font-family: 'Inter', system-ui, sans-serif; }
.lbl { font-size: 20px; font-weight: 600; fill: var(--text); text-anchor: middle; }
.lbl.warn { fill: var(--warn); }
.sub { font-family: 'JetBrains Mono', monospace !important; font-size: 14px; fill: var(--text-muted); }
.mid { text-anchor: middle; }

.src { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2; }
.dir { fill: var(--surface); stroke: var(--line); stroke-width: 1.5; }
.box { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2.5; filter: drop-shadow(0 0 12px rgba(34, 211, 238, .3)); }
.own { fill: var(--surface); stroke: var(--accent-edge); stroke-width: 1.5; }
.own-t { fill: var(--text); }
.shared { fill: rgba(245, 165, 36, .08); stroke: var(--warn); stroke-width: 2; }
.host { fill: none; stroke: var(--line); stroke-width: 2; stroke-dasharray: 8 6; }

.link { fill: none; stroke: var(--accent-edge); stroke-width: 2; }
.down { stroke: var(--warn); stroke-width: 2.5; stroke-dasharray: 6 5; }
.clash { font-family: 'JetBrains Mono', monospace !important; font-size: 15px; font-weight: 700; fill: var(--danger); text-anchor: middle; }

.reveal { opacity: 0; transition: opacity .5s; }
.reveal.on { opacity: 1; }
</style>
