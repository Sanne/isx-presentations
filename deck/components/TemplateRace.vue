<script setup lang="ts">
// Set up once: the same three tasks under two approaches, drawn as two
// separate panels (slide: clicks: 3). In each panel, the dashed line is the
// moment the tasks start; left of it is "ahead of time".
//  click 1: each task on a new, empty machine starts by repeating the same
//    setup (tools, clone, dependencies) before the work every task has to
//    do anyway: explore and patch, then test. The dependency step is kept
//    moderate, since many people have some form of cache. The counter shows what that costs: the setup's time, and a copy
//    of the tools and dependencies on disk, once per task. With a template
//    both are paid once: the build runs once, and branches share its disk by
//    copy-on-write (the "shared, not copied" clip).
//  click 2: with a template, the setup ran once, ahead of time (isx build);
//    each task is an isx branch of it and goes straight to the same work
//    (explore and patch, then test), so it finishes earlier.
//  click 3: the benefits, in words.
// No numbers on the axis on purpose: nobody has timed a real template build
// and branch on the presenter's laptop yet (MEASURE, in the slide notes).
// Static renders show the end state.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks, $renderContext } = useSlideContext()

const START = 420 // x of "the tasks start"
type Seg = { text: string; from: number; to: number; kind: 'setup' | 'long' | 'useful' | 'branch' }
// A task on an empty machine: the setup, then the work every task has to do.
const cold: Seg[] = [
  { text: 'tools', from: START, to: START + 76, kind: 'setup' },
  { text: 'git clone', from: START + 76, to: START + 176, kind: 'setup' },
  { text: 'dependencies', from: START + 176, to: START + 316, kind: 'long' },
  { text: 'explore & patch', from: START + 316, to: START + 526, kind: 'useful' },
  { text: 'test', from: START + 526, to: START + 616, kind: 'useful' },
]
// The template, built once before any task.
const tpl: Seg[] = [
  { text: 'tools', from: 116, to: 192, kind: 'setup' },
  { text: 'git clone', from: 192, to: 292, kind: 'setup' },
  { text: 'dependencies', from: 292, to: START - 12, kind: 'setup' },
]
// A task on a branch of it: the same work, with no setup in front of it.
const warm: Seg[] = [
  { text: '', from: START, to: START + 22, kind: 'branch' },
  { text: 'explore & patch', from: START + 22, to: START + 232, kind: 'useful' },
  { text: 'test', from: START + 232, to: START + 322, kind: 'useful' },
]
const COLD_MS = 7000, WARM_MS = 3600, STAGGER = 450
const ROW = 36, H = 28
// Two separate panels, one per approach, with a gap between them.
const PA = { y: 0, h: 190 }, PB = { y: 200, h: 206 }
const Y_A = PA.y + 64, Y_TPL = PB.y + 58, Y_B = Y_TPL + ROW + 4

const live = computed(() => ['slide', 'presenter'].includes($renderContext.value))
const now = ref(performance.now())
const t1 = ref<number | null>(null)
const t2 = ref<number | null>(null)
let raf = 0
const tick = () => { now.value = performance.now(); raf = requestAnimationFrame(tick) }
watch($clicks, c => {
  if (c >= 1 && t1.value === null) t1.value = performance.now()
  if (c < 1) t1.value = null
  if (c >= 2 && t2.value === null) t2.value = performance.now()
  if (c < 2) t2.value = null
  cancelAnimationFrame(raf)
  if (c >= 1) raf = requestAnimationFrame(tick)
}, { immediate: true })
onBeforeUnmount(() => cancelAnimationFrame(raf))

// How far each task has got, as an x coordinate; tasks start slightly staggered.
const progress = (start: number | null, k: number, ms: number, segs: Seg[], doneAt: number) => {
  const end = segs[segs.length - 1].to
  if (start === null) return START
  if (!live.value || $clicks.value >= doneAt) return end
  return Math.min(end, START + Math.max(0, (now.value - start - k * STAGGER) / ms) * (end - START))
}
const coldX = computed(() => [0, 1, 2].map(k => progress(t1.value, k, COLD_MS, cold, 2)))
const warmX = computed(() => [0, 1, 2].map(k => progress(t2.value, k, WARM_MS, warm, 3)))
const w = (s: Seg, x: number) => Math.max(0, Math.min(s.to, x) - s.from)
// Setups finished so far in the top group: the number the audience should count.
const setups = computed(() => coldX.value.filter(x => x >= cold[2].to).length)
// Where the brace sits: just after the branches' work ends.
const WARM_END = warm[warm.length - 1].to
</script>

<template>
  <svg class="tr" viewBox="0 0 1160 444" role="img"
       aria-label="Two approaches compared. Without a template, each of three tasks on a new, empty machine repeats the setup (tools, git clone, dependencies) before the same work of exploring, patching and testing. With an isx template, the setup ran once ahead of time, and three branches of it go straight to that work.">
    <!-- approach 1: no template, every task repeats the setup -->
    <rect class="panel warn-edge" x="0" :y="PA.y" width="1160" :height="PA.h" rx="12" />
    <text class="tag warn" x="18" :y="PA.y + 30">WITHOUT A TEMPLATE</text>
    <text class="group" x="252" :y="PA.y + 30">each task on a new, empty machine</text>
    <text class="count warn" x="1142" :y="PA.y + 30" text-anchor="end">setup time {{ setups }}× · disk {{ setups }}×</text>
    <line class="start" :x1="START" :y1="PA.y + 44" :x2="START" :y2="PA.y + PA.h - 14" />
    <text class="mini" :x="START + 8" :y="PA.y + 56">task starts</text>
    <g v-for="k in 3" :key="`c${k}`">
      <text class="who" x="18" :y="Y_A + (k - 1) * ROW + 19">task {{ k }}</text>
      <g v-for="s in cold" :key="s.text">
        <rect class="slot" :x="s.from + 2" :y="Y_A + (k - 1) * ROW" :width="s.to - s.from - 4" :height="H" rx="6" />
        <rect class="seg" :class="s.kind" :x="s.from + 2" :y="Y_A + (k - 1) * ROW" :width="Math.max(0, w(s, coldX[k - 1]) - 4)" :height="H" rx="6" />
        <text class="st" :class="{ dim: coldX[k - 1] <= s.from }" :x="s.from + 12" :y="Y_A + (k - 1) * ROW + 19">{{ s.text }}</text>
      </g>
    </g>
    <text class="brace warn" :x="START + 90" :y="Y_A + 3 * ROW + 8">↑ the same setup, repeated by every task</text>

    <!-- approach 2: an isx template, the setup ran once -->
    <g class="reveal" :class="{ on: $clicks >= 2 }">
      <rect class="panel accent-edge" x="0" :y="PB.y" width="1160" :height="PB.h" rx="12" />
      <text class="tag accent" x="18" :y="PB.y + 30">WITH AN ISX TEMPLATE</text>
      <text class="group" x="252" :y="PB.y + 30">each task on a branch of it</text>
      <text class="count accent" x="1142" :y="PB.y + 30" text-anchor="end">setup time 1× · disk 1×, shared by every branch</text>
      <line class="start" :x1="START" :y1="PB.y + 44" :x2="START" :y2="PB.y + PB.h - 14" />
      <text class="mini" x="116" :y="PB.y + 50">ahead of time</text>
      <text class="mini" :x="START + 8" :y="PB.y + 50">task starts</text>
      <text class="who accent" x="18" :y="Y_TPL + 19">tpl-java</text>
      <g v-for="s in tpl" :key="`t${s.text}`">
        <rect class="seg done" :x="s.from + 2" :y="Y_TPL" :width="s.to - s.from - 4" :height="H" rx="6" />
        <text class="st" :x="s.from + 12" :y="Y_TPL + 19">{{ s.text }}</text>
      </g>
      <text class="note" x="116" :y="Y_TPL + H + 16">isx build, once</text>
      <g v-for="k in 3" :key="`w${k}`">
        <path class="link" :d="`M${START - 10} ${Y_TPL + H} C ${START - 10} ${Y_B + (k - 1) * ROW + H / 2}, ${START - 10} ${Y_B + (k - 1) * ROW + H / 2}, ${START + 2} ${Y_B + (k - 1) * ROW + H / 2}`" />
        <text class="who" x="18" :y="Y_B + (k - 1) * ROW + 19">task {{ k }}</text>
        <g v-for="(s, i) in warm" :key="`w${k}${i}`">
          <rect class="slot" :x="s.from + 2" :y="Y_B + (k - 1) * ROW" :width="s.to - s.from - 4" :height="H" rx="6" />
          <rect class="seg" :class="s.kind" :x="s.from + 2" :y="Y_B + (k - 1) * ROW" :width="Math.max(0, w(s, warmX[k - 1]) - 4)" :height="H" rx="6" />
          <text v-if="s.text" class="st" :class="{ dim: warmX[k - 1] <= s.from }" :x="s.from + 12" :y="Y_B + (k - 1) * ROW + 19">{{ s.text }}</text>
        </g>
      </g>
      <text class="brace accent" :x="WARM_END + 16" :y="Y_B + ROW + 19">← the same work, with no setup in front of it</text>
    </g>

    <!-- the benefits -->
    <g class="reveal" :class="{ on: $clicks >= 3 }">
      <text class="verdict" x="0" y="438">Set up once, not once per task: <tspan class="benefit">no setup at the start of each task, and nothing stored twice.</tspan></text>
    </g>
  </svg>
</template>

<style scoped>
.tr { width: 100%; height: auto; display: block; overflow: visible; }
.tr text { font-family: 'Inter', system-ui, sans-serif; }
.panel { fill: var(--surface); stroke-width: 1.5; }
.warn-edge { stroke: rgba(245, 165, 36, .45); }
.accent-edge { stroke: var(--accent-edge); }
.tag { font-size: 15px; font-weight: 800; letter-spacing: .08em; }
.mini { font-family: 'JetBrains Mono', monospace !important; font-size: 12px; fill: var(--text-muted); }
.start { stroke: var(--text-muted); stroke-width: 1.5; stroke-dasharray: 6 5; }
.group { font-size: 18px; font-weight: 600; fill: var(--text); }
.who, .st, .count, .note, .brace { font-family: 'JetBrains Mono', monospace !important; }
.who { font-size: 15px; fill: var(--text-muted); }
.who.accent { font-weight: 700; }
.st { font-size: 14px; fill: var(--text); transition: opacity .3s; }
.dim { opacity: .3; }
.count { font-size: 17px; font-weight: 700; }
.note { font-size: 13px; fill: var(--text-muted); }
.brace { font-size: 14px; }
.warn { fill: var(--warn); }
.accent { fill: var(--accent); }
.verdict { font-size: 22px; font-weight: 700; fill: var(--text); }
.benefit { font-weight: 400; fill: var(--text-muted); }

.slot { fill: none; stroke: var(--line); stroke-dasharray: 4 4; }
.seg { stroke-width: 1; }
.seg.setup { fill: rgba(245, 165, 36, .08); stroke: rgba(245, 165, 36, .5); }
.seg.long { fill: rgba(245, 165, 36, .16); stroke: var(--warn); }
.seg.useful { fill: var(--accent-soft); stroke: var(--accent); }
.seg.branch { fill: var(--accent); stroke: var(--accent); }
.seg.done { fill: var(--surface-2); stroke: var(--accent-edge); }
.link { fill: none; stroke: var(--accent-edge); stroke-width: 2; }

.reveal { opacity: 0; transition: opacity .5s; }
.reveal.on { opacity: 1; }
</style>
