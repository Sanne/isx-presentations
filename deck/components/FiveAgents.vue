<script setup lang="ts">
// Five agents, one of you: the sequel to ThirtyMinutes.vue, in the same
// visual language (slide: clicks: 2).
//  click 1: 30 illustrative minutes play in real time. Each agent works until
//    it hits a prompt, then waits (hatched) until you get to it. You can only
//    be in one lane at a time, you answer in the order they asked, and each
//    answer costs you 1.5 minutes of reading and switching back. The more
//    lanes wait, the longer each waits. Lane 1 finishes; lanes 4 and 5 spend
//    most of their time waiting.
//  click 2: the verdict.
// The schedule is simulated below rather than hand-drawn, so it's consistent:
// nothing here is measured. Static renders show the end state.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks, $renderContext } = useSlideContext()

const END = 30 // minutes on the axis
const DUR = 25000 // real milliseconds for the whole clip
const DWELL = 1.5 // minutes you spend on each prompt, switching included

// Each agent's task, as the minutes of work between its prompts.
const tasks = [
  { name: 'fix a failing test', work: [4, 3, 3] },
  { name: 'bump dependencies', work: [2, 4, 3, 5] },
  { name: 'migrate the schema', work: [3, 2, 2, 4, 3] },
  { name: 'hunt a flaky test', work: [1, 2, 1, 2, 1, 2, 2] },
  { name: 'build the docs', work: [1, 1, 2, 1, 1, 1, 2, 2] },
]

type Seg = { from: number; to: number; kind: 'work' | 'wait' }
type Visit = { from: number; to: number; lane: number }

// A first-come, first-served queue with one server: you.
const simulate = () => {
  const STEP = 0.05
  const st = tasks.map(t => ({ chunk: 0, until: t.work[0], state: 'work' as 'work' | 'wait' | 'done', since: 0 }))
  const segs: Seg[][] = tasks.map(() => [])
  const visits: Visit[] = []
  const queue: number[] = []
  let you: number | null = null
  let youUntil = 0
  for (let n = 0; n * STEP <= END; n++) {
    const t = +(n * STEP).toFixed(2)
    st.forEach((s, i) => {
      if (s.state !== 'work' || t < s.until) return
      segs[i].push({ from: s.since, to: t, kind: 'work' })
      if (++s.chunk >= tasks[i].work.length) { s.state = 'done'; return }
      s.state = 'wait'; s.since = t; queue.push(i)
    })
    if (you !== null && t >= youUntil) {
      const s = st[you]
      segs[you].push({ from: s.since, to: t, kind: 'wait' })
      s.state = 'work'; s.since = t; s.until = t + tasks[you].work[s.chunk]
      you = null
    }
    if (you === null && queue.length) {
      you = queue.shift()!
      youUntil = t + DWELL
      visits.push({ from: t, to: youUntil, lane: you })
    }
  }
  st.forEach((s, i) => { if (s.state !== 'done') segs[i].push({ from: s.since, to: END, kind: s.state }) })
  const doneAt = st.map((s, i) => (s.state === 'done' ? segs[i][segs[i].length - 1].to : null))
  return { segs, visits, doneAt }
}
const { segs, visits, doneAt } = simulate()

const moods = [
  { face: '🙂', label: 'focused' }, { face: '😐', label: 'interrupted' }, { face: '😣', label: 'frazzled' },
  { face: '😣', label: 'frazzled' }, { face: '😵', label: 'on autopilot' }, { face: '🤯', label: 'fried' },
]
const focusLeft = [100, 72, 50, 34, 16, 4]

// Playback, as in ThirtyMinutes.vue.
const live = computed(() => ['slide', 'presenter'].includes($renderContext.value))
const now = ref(performance.now())
const start = ref<number | null>(null)
let raf = 0
const tick = () => { now.value = performance.now(); raf = requestAnimationFrame(tick) }
watch($clicks, c => {
  if (c >= 1 && start.value === null) start.value = performance.now()
  if (c < 1) start.value = null
  cancelAnimationFrame(raf)
  if (c >= 1) raf = requestAnimationFrame(tick)
}, { immediate: true })
onBeforeUnmount(() => cancelAnimationFrame(raf))

const m = computed(() => {
  if ($clicks.value < 1 || start.value === null) return 0
  if (!live.value || $clicks.value >= 2) return END
  return Math.min(END, ((now.value - start.value) / DUR) * END)
})
watch(m, v => { if (v >= END) cancelAnimationFrame(raf) })

const pct = (x: number) => `${(x / END) * 100}%`
const shown = (s: Seg) => ({ left: pct(s.from), width: pct(Math.max(0, Math.min(s.to, m.value) - s.from)) })

const visit = computed(() => visits.find(v => v.from <= m.value && m.value < v.to) ?? null)
const switches = computed(() => visits.filter(v => v.from <= m.value).length)
const moodIdx = computed(() => Math.min(moods.length - 1, Math.floor(switches.value / 4)))
const mood = computed(() => moods[moodIdx.value])
const stateAt = (i: number) => {
  const d = doneAt[i]
  if (d !== null && m.value >= d) return 'done'
  const s = segs[i].find(s => s.from <= m.value && m.value < s.to)
  return s?.kind ?? 'work'
}
// Share of the agents' time so far spent waiting for you.
const waitShare = computed(() => {
  if (m.value <= 0) return 0
  const w = segs.flat().filter(s => s.kind === 'wait').reduce((a, s) => a + Math.max(0, Math.min(s.to, m.value) - s.from), 0)
  const alive = tasks.reduce((a, _, i) => a + Math.min(m.value, doneAt[i] ?? END), 0)
  return Math.round((w / alive) * 100)
})
const waiting = computed(() => (m.value <= 0 ? 0 : tasks.filter((_, i) => stateAt(i) === 'wait').length))
// The cursor rests on the lane you're answering; between prompts it stays put.
const lastLane = computed(() => {
  const past = visits.filter(v => v.from <= m.value)
  return past.length ? past[past.length - 1].lane : 0
})
const ROW = 58
</script>

<template>
  <div class="fa">
    <div class="axis">
      <span v-for="x in [0, 10, 20, 30]" :key="x" :style="{ left: pct(x) }">{{ x }} min</span>
    </div>
    <div class="body">
      <div class="lanes">
        <!-- the attention cursor: you, in one lane at a time -->
        <div class="cursor" :class="{ busy: visit, fried: moodIdx >= 4 }" :style="{ top: `${lastLane * ROW}px` }">
          <span class="face">{{ mood.face }}</span>
        </div>
        <div v-for="(t, i) in tasks" :key="t.name" class="row" :class="{ here: visit?.lane === i }">
          <div class="who">agent-{{ i + 1 }}<small>{{ t.name }}</small></div>
          <div class="track">
            <div v-for="(s, k) in segs[i]" v-show="m > s.from" :key="k" class="seg" :class="`a-${s.kind}`" :style="shown(s)" />
            <span v-if="doneAt[i] !== null" class="done" :class="{ on: m >= doneAt[i]! }" :style="{ left: pct(doneAt[i]!) }">✓ done</span>
          </div>
        </div>
      </div>
      <div class="side">
        <div class="now" :class="{ warn: waiting >= 2, bad: waiting >= 4, gone: m >= END }">now: <b>{{ waiting }}</b> of 5 waiting for you</div>
        <div class="count" :class="{ warn: waitShare >= 25, bad: waitShare >= 45 }">
          <b>{{ waitShare }}%</b><span>of their time,<br>waiting for you</span>
        </div>
        <div class="mind" :class="{ strained: moodIdx >= 2, fried: moodIdx >= 4 }">
          <span class="mood">you: {{ mood.label }}<i :style="{ width: `${focusLeft[moodIdx]}%` }" /></span>
          <span class="sw">{{ switches }} switches</span>
        </div>
      </div>
    </div>
    <div class="status" :class="{ on: $clicks >= 2 }">Five agents. One of you. You're the scheduler now, and you're the bottleneck.</div>
  </div>
</template>

<style scoped>
.fa { display: flex; flex-direction: column; gap: 8px; }
.axis { position: relative; height: 18px; margin: 0 264px 0 210px; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-muted); }
.axis span { position: absolute; transform: translateX(-50%); }
.body { display: grid; grid-template-columns: 1fr 200px; gap: 64px; align-items: center; }

.lanes { position: relative; }
.row { display: grid; grid-template-columns: 210px 1fr; align-items: center; height: 58px; }
.who { font-family: 'JetBrains Mono', monospace; font-size: 17px; color: var(--text-muted); display: flex; flex-direction: column; padding-left: 48px; transition: color .3s; }
.who small { font-family: 'Inter', sans-serif; font-size: 13px; opacity: .8; }
.row.here .who { color: var(--text); }
.track { position: relative; height: 44px; border-left: 1px solid var(--line); border-right: 1px solid var(--line); }
.seg { position: absolute; top: 4px; bottom: 4px; border-radius: 5px; }
.a-work { background: var(--accent-soft); border: 1px solid var(--accent-edge); }
.a-wait { background: repeating-linear-gradient(135deg, rgba(245,165,36,.28) 0 6px, transparent 6px 12px); border: 1px solid var(--warn); }
.done { position: absolute; top: 50%; transform: translateY(-50%); padding-left: 8px; font-size: 14px; font-weight: 600; color: var(--accent); white-space: nowrap; opacity: 0; transition: opacity .4s; }
.done.on { opacity: 1; }

.cursor { position: absolute; left: 0; height: 58px; display: flex; align-items: center; transition: top .45s cubic-bezier(.5, 0, .3, 1); }
.cursor .face { font-size: 34px; line-height: 1; opacity: .55; transition: opacity .3s; }
.cursor.busy .face { opacity: 1; filter: drop-shadow(0 0 8px rgba(245, 165, 36, .7)); }
.cursor.fried .face { animation: shake .4s infinite; filter: drop-shadow(0 0 10px rgba(255, 77, 109, .8)); }
@keyframes shake { 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }

.side { display: flex; flex-direction: column; gap: 18px; }
.now { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--text-muted); transition: opacity .4s; }
.now b { font-size: 20px; color: var(--accent); }
.now.warn b { color: var(--warn); }
.now.bad b { color: var(--danger); }
.now.gone { opacity: 0; }
.count { display: flex; flex-direction: column; gap: 4px; color: var(--text-muted); font-size: 17px; line-height: 1.25; }
.count b { font-family: 'JetBrains Mono', monospace; font-size: 64px; line-height: 1; color: var(--accent); transition: color .4s; }
.count.warn b { color: var(--warn); }
.count.bad b { color: var(--danger); }
.mind { display: flex; flex-direction: column; gap: 6px; }
.mood { display: flex; flex-direction: column; gap: 6px; font-size: 18px; font-weight: 600; color: var(--text-muted); }
.mood i { display: block; height: 6px; border-radius: 3px; background: var(--accent); transition: width .5s, background .5s; }
.sw { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--text-muted); }
.mind.strained .mood { color: var(--warn); }
.mind.strained .mood i { background: var(--warn); }
.mind.fried .mood { color: var(--danger); }
.mind.fried .mood i { background: var(--danger); }

.status { margin-top: 6px; padding-left: 210px; font-size: 22px; font-weight: 600; color: var(--danger); opacity: 0; transition: opacity .5s; }
.status.on { opacity: 1; }
</style>
