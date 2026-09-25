<script setup lang="ts">
// Branch a live machine (slide: clicks: 3).
//  click 1: repro-1, branched from the template, after an hour of setup:
//    the bug from a report, reproduced by a test that fails every time.
//  click 2: fix-a and fix-b branch from repro-1, and inherit all of it.
//  click 3: they diverge; each owns only the blocks it changed.
// What carries over, per the code: `isx branch --from <instance>` is an
// Incus copy of the instance's disk, and the copy boots its own systemd. So
// the checkout, the build output and the test come along; nothing in memory
// does, which is why the story is told in files, not running processes.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()
const step = computed(() => $clicks.value)

const setup = ['the version from the report', 'built with the same dependencies', 'a test that shows the bug']
const fixes = [
  { name: 'fix-a', y: 10, ok: true },
  { name: 'fix-b', y: 190, ok: false },
]
const R = { x: 230, y: 30, w: 420, h: 280 } // repro-1
const F = { x: 776, w: 370, h: 150 } // each fix
</script>

<template>
  <svg class="lb" viewBox="0 0 1160 380" role="img"
       aria-label="A template, a prepared reproducer machine with an hour of setup and a failing test, and two branches of it, fix-a and fix-b, each inheriting the setup; fix-a passes, fix-b still fails.">
    <!-- the template -->
    <rect class="src" x="0" :y="R.y + R.h / 2 - 40" width="170" height="80" rx="10" />
    <text class="lbl mid" x="85" :y="R.y + R.h / 2 - 6">tpl-java</text>
    <text class="sub mid" x="85" :y="R.y + R.h / 2 + 20">template</text>

    <!-- the prepared reproducer -->
    <g class="reveal" :class="{ on: step >= 1 }">
      <path class="link" :d="`M170 ${R.y + R.h / 2} L ${R.x} ${R.y + R.h / 2}`" />
      <rect class="box" :x="R.x" :y="R.y" :width="R.w" :height="R.h" rx="12" />
      <text class="lbl" :x="R.x + 24" :y="R.y + 40">repro-1</text>
      <text class="sub" :x="R.x + R.w - 24" :y="R.y + 40" text-anchor="end">an hour of setup</text>
      <g v-for="(s, i) in setup" :key="s" class="stagger" :style="{ transitionDelay: `${0.3 + i * 0.35}s` }">
        <rect class="layer" :x="R.x + 24" :y="R.y + 64 + i * 46" :width="R.w - 48" height="38" rx="6" />
        <text class="lt" :x="R.x + 40" :y="R.y + 89 + i * 46">{{ s }}</text>
      </g>
      <text class="fail" :x="R.x + 24" :y="R.y + 244">✗ the test fails, every time</text>
    </g>

    <!-- two branches of it -->
    <g v-for="f in fixes" :key="f.name" class="reveal" :class="{ on: step >= 2 }">
      <path class="link" :d="`M${R.x + R.w} ${R.y + R.h / 2} C ${R.x + R.w + 70} ${R.y + R.h / 2}, ${F.x - 70} ${f.y + F.h / 2}, ${F.x} ${f.y + F.h / 2}`" />
      <rect class="box" :class="{ ok: step >= 3 && f.ok, bad: step >= 3 && !f.ok }" :x="F.x" :y="f.y" :width="F.w" :height="F.h" rx="12" />
      <text class="lbl" :x="F.x + 20" :y="f.y + 34">{{ f.name }}</text>
      <text class="cmd" :x="F.x + F.w - 20" :y="f.y + 33" text-anchor="end">--from repro-1</text>
      <rect class="inherited" :x="F.x + 20" :y="f.y + 50" :width="F.w - 40" height="32" rx="6" />
      <text class="lt dimmed" :x="F.x + 34" :y="f.y + 71">inherited: the hour of setup</text>
      <text class="sub" :x="F.x + 20" :y="f.y + 109">starts from the failing test</text>
      <!-- click 3: each goes its own way, owning only what it changed -->
      <g class="reveal" :class="{ on: step >= 3 }">
        <text :class="f.ok ? 'pass' : 'fail'" :x="F.x + 20" :y="f.y + 138">{{ f.ok ? '✓ passes' : '✗ still fails' }}</text>
        <rect v-for="k in (f.ok ? 3 : 2)" :key="k" class="own" :x="F.x + F.w - 20 - k * 20" :y="f.y + 125" width="14" height="14" rx="2" />
        <text class="sub" :x="F.x + F.w - 20 - (f.ok ? 3 : 2) * 20 - 8" :y="f.y + 138" text-anchor="end">its changes</text>
      </g>
    </g>

    <text class="verdict reveal" :class="{ on: step >= 3 }" x="0" y="372">The setup was done once. Each branch paid only for what it changed.</text>
  </svg>
</template>

<style scoped>
.lb { width: 100%; height: auto; display: block; overflow: visible; }
.lb text { font-family: 'Inter', system-ui, sans-serif; }
.lbl { font-size: 22px; font-weight: 700; fill: var(--text); }
.mid { text-anchor: middle; }
.sub, .cmd, .lt, .fail, .pass { font-family: 'JetBrains Mono', monospace !important; }
.sub { font-size: 14px; fill: var(--text-muted); }
.cmd { font-size: 14px; fill: var(--accent); }
.lt { font-size: 15px; fill: var(--text); }
.lt.dimmed { fill: var(--text-muted); }
.fail { font-size: 17px; font-weight: 700; fill: var(--danger); }
.pass { font-size: 17px; font-weight: 700; fill: var(--accent); }
.verdict { font-size: 22px; font-weight: 600; fill: var(--text); }

.src { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2; }
.box { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2.5; filter: drop-shadow(0 0 12px rgba(34, 211, 238, .25)); transition: stroke .5s, filter .5s; }
.box.ok { filter: drop-shadow(0 0 16px rgba(34, 211, 238, .55)); }
.box.bad { stroke: var(--danger); filter: drop-shadow(0 0 12px rgba(255, 77, 109, .35)); }
.layer { fill: var(--surface); stroke: var(--line); }
.inherited { fill: var(--surface); stroke: var(--line); stroke-dasharray: 5 4; }
.own { fill: var(--accent-soft); stroke: var(--accent); }
.dot { fill: var(--accent); filter: drop-shadow(0 0 5px var(--accent)); }
.link { fill: none; stroke: var(--accent-edge); stroke-width: 2.5; }

.reveal { opacity: 0; transition: opacity .5s; }
.reveal.on { opacity: 1; }
.stagger { opacity: 0; transition: opacity .4s; }
.reveal.on .stagger { opacity: 1; }
</style>
