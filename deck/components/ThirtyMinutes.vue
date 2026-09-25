<script setup lang="ts">
// Where did your 36 minutes go? The OpenJDK task from the terminal scenes,
// replayed as two animated timelines (slide: clicks: 2):
//  click 1, "With prompts": the agent keeps stopping to wait for you; you
//    keep getting pulled out of your own work, answer more and more
//    carelessly, and end up just watching it, with a fried mind.
//  click 2, "On isx": replaces the first panel; the agent and you each get
//    on with it, and the clip stops when the agent is done, at 10:24.
// Times match the openjdkSandbox / openjdkIsx scenes. `make images` was
// measured at ~15 minutes with the dependencies in place (2026-09-25); the
// clone, configure and test durations are still estimates. In print and overview
// renders the animations show their end state.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks, $renderContext } = useSlideContext()

const END = 36 // minutes on the axis: with prompts the task ends at 10:36
const END_B = 24.5 // on isx the agent is done at 10:24, and the clip stops there
const DUR_A = 28000, DUR_B = 14000 // real milliseconds per animation, slow enough to talk over

type Seg = { from: number; to: number; kind: string; text?: string }

const agentA: Seg[] = [
  { from: 0, to: 1, kind: 'work' }, { from: 1, to: 2.5, kind: 'wait' },
  { from: 2.5, to: 3.5, kind: 'work' }, { from: 3.5, to: 5.5, kind: 'wait', text: 'waiting' },
  { from: 5.5, to: 8, kind: 'work', text: 'configure' }, { from: 8, to: 11, kind: 'wait', text: 'waiting' },
  { from: 11, to: 12, kind: 'work' }, { from: 12, to: 14.5, kind: 'wait', text: 'waiting' },
  { from: 14.5, to: 15.5, kind: 'work' }, { from: 15.5, to: 16.5, kind: 'wait' },
  { from: 16.5, to: 31.5, kind: 'work', text: 'make images (15 min)' }, { from: 31.5, to: 33, kind: 'wait' },
  { from: 33, to: 36, kind: 'work', text: 'test' },
]
const youA: Seg[] = [
  { from: 0, to: 2.5, kind: 'task', text: 'PR review' }, { from: 2.5, to: 3.5, kind: 'refocus' },
  { from: 3.5, to: 5.5, kind: 'task', text: 'PR…' }, { from: 5.5, to: 6.5, kind: 'refocus' },
  { from: 6.5, to: 11, kind: 'task', text: 'PR review' }, { from: 11, to: 12, kind: 'refocus' },
  { from: 12, to: 14.5, kind: 'task', text: 'PR…' },
  { from: 14.5, to: 36, kind: 'watch', text: 'gave up on the PR: watching it, answering it' },
]
// Each prompt: when it appeared, when you answered, and how.
const prompts = [
  { at: 1, answered: 2.5, cmd: 'git clone https://github.com/openjdk/jdk', you: 'read it · allowed', careless: false },
  { at: 3.5, answered: 5.5, cmd: 'curl -LO https://download.java.net/…', you: 'allowed', careless: false },
  { at: 8, answered: 11, cmd: 'sudo dnf install cups-devel', you: 'allowed · as root', careless: false },
  { at: 12, answered: 14.5, cmd: 'sudo dnf install fontconfig-devel', you: "allowed · didn't read it", careless: true },
  { at: 15.5, answered: 16.5, cmd: 'sudo dnf install alsa-lib-devel', you: '"Yes, and don\'t ask again"', careless: true },
  { at: 31.5, answered: 33, cmd: 'run outside the sandbox: mvn verify', you: 'allowed · what did it just run?', careless: true },
]
const moods = [
  { face: '🙂', label: 'focused' }, { face: '😐', label: 'interrupted' }, { face: '😐', label: 'interrupted' },
  { face: '😣', label: 'frazzled' }, { face: '😣', label: 'frazzled' }, { face: '😵', label: 'on autopilot' },
  { face: '🤯', label: 'fried' },
]
const focusLeft = [100, 82, 66, 48, 34, 18, 6]

const agentB: Seg[] = [{ from: 0, to: 24.5, kind: 'work', text: 'clone · deps · configure · make images (15 min) · test · commit' }]
const youB: Seg[] = [
  { from: 0, to: 16, kind: 'task', text: 'reviewed the PR ✓' },
  { from: 16, to: 24.5, kind: 'task', text: 'started a second agent' },
]

// Playback: a phase starts when its click is reached; print, overview and
// other static renders jump to the end state.
const live = computed(() => ['slide', 'presenter'].includes($renderContext.value))
const now = ref(performance.now())
const startA = ref<number | null>(null)
const startB = ref<number | null>(null)
let raf = 0
const tick = () => { now.value = performance.now(); raf = requestAnimationFrame(tick) }
watch($clicks, c => {
  if (c >= 1 && startA.value === null) startA.value = performance.now()
  if (c < 1) startA.value = null
  if (c >= 2 && startB.value === null) startB.value = performance.now()
  if (c < 2) startB.value = null
  cancelAnimationFrame(raf)
  if (c >= 1) raf = requestAnimationFrame(tick)
}, { immediate: true })
onBeforeUnmount(() => cancelAnimationFrame(raf))

const minute = (start: number | null, dur: number, end: number) =>
  start === null ? 0 : !live.value ? end : Math.min(end, ((now.value - start) / dur) * end)
const mA = computed(() => ($clicks.value >= 1 ? minute(startA.value, DUR_A, END) : 0))
const mB = computed(() => ($clicks.value >= 2 ? minute(startB.value, DUR_B, END_B) : 0))

const pct = (m: number) => `${(m / END) * 100}%`
const shown = (s: Seg, m: number) => ({ left: pct(s.from), width: pct(Math.max(0, Math.min(s.to, m) - s.from)) })

const answeredSoFar = computed(() => prompts.filter(p => p.answered <= mA.value).length)
const mood = computed(() => moods[answeredSoFar.value])
const current = computed(() => {
  const m = mA.value
  const waiting = prompts.find(p => p.at <= m && m < p.answered)
  if (waiting) return { kind: 'wait', text: `agent waiting: ${waiting.cmd}` }
  const last = [...prompts].reverse().find(p => p.answered <= m)
  if (m >= END) return { kind: 'sum', text: 'The agent waited 11½ minutes for you. You finished nothing. You learned nothing. And now you\'re exhausted.' }
  if (last && m - last.answered < 2.5) return { kind: last.careless ? 'bad' : 'ok', text: `you: ${last.you} — ${last.cmd}` }
  return null
})
const doneB = computed(() => mB.value >= END_B)
</script>

<template>
  <div class="tm">
    <div class="axis">
      <span v-for="m in [0, 10, 20, 30]" :key="m" :style="{ left: pct(m) }">10:{{ String(m).padStart(2, '0') }}</span>
    </div>

    <!-- With prompts: on screen until the isx panel replaces it; static renders show both -->
    <div v-show="$clicks < 2 || !live" class="panel">
      <div class="panel-head warn">With prompts</div>
      <div class="row">
        <div class="who">the agent</div>
        <div class="track">
          <div v-for="(s, i) in agentA" v-show="mA > s.from" :key="i" class="seg" :class="`a-${s.kind}`" :style="shown(s, mA)">
            <span v-if="s.text && mA >= s.to">{{ s.text }}</span>
          </div>
        </div>
        <div class="mind" />
      </div>
      <div class="row">
        <div class="who">you</div>
        <div class="track">
          <div v-for="(s, i) in youA" v-show="mA > s.from" :key="i" class="seg" :class="`y-${s.kind}`" :style="shown(s, mA)">
            <span v-if="s.text && mA >= Math.min(s.to, s.from + 3)">{{ s.text }}</span>
          </div>
          <span v-for="p in prompts" v-show="p.answered <= mA" :key="p.at" class="zap" :style="{ left: pct(p.answered) }">⚡</span>
        </div>
        <div class="mind" :class="{ strained: answeredSoFar >= 3, fried: answeredSoFar >= 5 }">
          <span class="face">{{ mood.face }}</span>
          <span class="mood">{{ mood.label }}<i :style="{ width: `${focusLeft[answeredSoFar]}%` }" /></span>
        </div>
      </div>
      <div class="status" :class="current?.kind">{{ current?.text ?? ' ' }}</div>
    </div>

    <!-- On isx: takes the first panel's place -->
    <div v-show="$clicks >= 2" class="panel reveal" :class="{ on: $clicks >= 2 }">
      <div class="panel-head accent">On isx</div>
      <div class="row">
        <div class="who">the agent</div>
        <div class="track">
          <div v-for="(s, i) in agentB" v-show="mB > s.from" :key="i" class="seg a-work" :style="shown(s, mB)">
            <span v-if="mB >= 8">{{ s.text }}</span>
          </div>
          <span class="mark" :class="{ on: doneB }" :style="{ left: pct(36) }">10:36 with prompts</span>
        </div>
        <div class="mind" />
      </div>
      <div class="row">
        <div class="who">you</div>
        <div class="track">
          <div v-for="(s, i) in youB" v-show="mB > s.from" :key="i" class="seg y-task" :style="shown(s, mB)">
            <span v-if="mB >= Math.min(s.to, s.from + 6)">{{ s.text }}</span>
          </div>
        </div>
        <div class="mind">
          <span class="face">🙂</span>
          <span class="mood">focused<i style="width: 100%" /></span>
        </div>
      </div>
      <div class="status ok">{{ doneB ? 'Done at 10:24, not 10:36. Zero approvals. The PR is reviewed, and a second agent is running.' : ' ' }}</div>
    </div>
  </div>
</template>

<style scoped>
.tm { display: flex; flex-direction: column; gap: 10px; }
.axis { position: relative; height: 18px; margin: 0 160px 0 120px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-muted); }
.axis span { position: absolute; transform: translateX(-50%); }

.panel { display: flex; flex-direction: column; gap: 6px; }
.panel-head { font-size: 18px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.panel-head.warn { color: var(--warn); }
.panel-head.accent { color: var(--accent); }

.row { display: grid; grid-template-columns: 120px 1fr 160px; align-items: center; }
.who { font-size: 18px; color: var(--text-muted); }
.track { position: relative; height: 50px; border-left: 1px solid var(--line); border-right: 1px solid var(--line); }

.seg {
  position: absolute; top: 4px; bottom: 4px; overflow: hidden; white-space: nowrap;
  border-radius: 5px; display: flex; align-items: center;
}
.seg span { padding: 0 8px; font-size: 13px; }
.a-work  { background: var(--accent-soft); border: 1px solid var(--accent-edge); color: var(--accent); }
.a-wait  { background: repeating-linear-gradient(135deg, rgba(245,165,36,.28) 0 6px, transparent 6px 12px); border: 1px solid var(--warn); color: var(--warn); }
.y-task  { background: var(--surface-2); border: 1px solid var(--line); color: var(--text); }
.y-refocus { background: repeating-linear-gradient(135deg, rgba(139,152,176,.25) 0 5px, transparent 5px 10px); }
.y-watch { background: rgba(255, 77, 109, .10); border: 1px dashed var(--danger); color: var(--danger); }
.mark { position: absolute; top: -4px; bottom: -4px; border-left: 2px dashed var(--warn); padding-left: 6px; font-size: 12px; color: var(--warn); white-space: nowrap; line-height: 1.2; opacity: 0; transition: opacity .6s; }
.mark.on { opacity: 1; }
.zap { position: absolute; top: -8px; transform: translateX(-50%); font-size: 18px; filter: drop-shadow(0 0 6px var(--danger)); }

.mind { display: flex; align-items: center; gap: 8px; padding-left: 14px; }
.face { font-size: 42px; line-height: 1; transition: transform .3s; }
.mood { display: flex; flex-direction: column; gap: 5px; font-size: 16px; font-weight: 600; color: var(--text-muted); width: 96px; }
.mood i { display: block; height: 5px; border-radius: 3px; background: var(--accent); transition: width .5s, background .5s; }
.mind.strained .mood { color: var(--warn); }
.mind.strained .mood i { background: var(--warn); }
.mind.fried .mood { color: var(--danger); }
.mind.fried .face { filter: drop-shadow(0 0 10px rgba(255, 77, 109, .8)); }
.mind.fried .mood i { background: var(--danger); }
.mind.fried .face { animation: shake .4s infinite; }
@keyframes shake { 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }

.status { min-height: 24px; font-family: 'JetBrains Mono', monospace; font-size: 15px; padding-left: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.status.wait { color: var(--warn); }
.status.ok { color: var(--accent); }
.status.bad { color: var(--danger); }
.status.sum { color: var(--danger); font-family: 'Inter', sans-serif; font-size: 19px; font-weight: 600; white-space: normal; }

.reveal { opacity: 0; transition: opacity .5s; }
.reveal.on { opacity: 1; }
</style>
