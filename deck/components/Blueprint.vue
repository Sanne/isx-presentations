<script setup lang="ts">
// The design of isx, built up over the talk. One picture of your laptop that
// gains a part each time a choice is made, beside a ledger that says which
// problem the part answers. It replaces a checklist: nothing appears at the
// end that the room didn't watch arrive.
//  stage: the last stage this slide reaches (1..6)
//  from:  the stage already lit when the slide opens (clicks: stage - from,
//         plus one if `reveal`, for the "This is isx" title)
// Stages: 1 a machine of its own · 2 template and branches · 3 the cache ·
// 4 keys never enter · 5 its own identity · 6 a commit, over git
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{ stage: number; from?: number; reveal?: boolean }>(), { from: 0, reveal: false })
const { $clicks } = useSlideContext()
const shown = computed(() => Math.min(props.stage, props.from + $clicks.value))
const lit = (k: number) => shown.value >= k
const fresh = (k: number) => shown.value === k && k > props.from
const done = computed(() => props.reveal && $clicks.value >= props.stage - props.from + 1)

const ledger = [
  { problem: 'You became the approve button.', choice: 'A machine of its own. Say yes once.' },
  { problem: 'Five agents, one localhost.', choice: 'Branch the whole machine, not the checkout.' },
  { problem: 'Five machines, one internet.', choice: 'Cache only what upstream would send again.' },
  { problem: 'It has to log in.', choice: 'Keys never enter. The proxy adds them on the way out.' },
  { problem: 'Everything it does is in your name.', choice: 'An identity of its own.' },
  { problem: 'Getting the work back.', choice: 'A commit, over git. Not a mount.' },
]
const machines = [
  { name: 'agent-1', x: 250, k: 1 },
  { name: 'agent-2', x: 392, k: 2 },
  { name: 'agent-3', x: 534, k: 2 },
]
</script>

<template>
  <div class="bp">
    <svg class="draw" viewBox="0 0 700 432" role="img"
         aria-label="Your laptop. Your keys, files and repository stay outside. Inside the isx pool: a template and machines branched from it. A proxy holds the keys, adds them to requests on the way out, caches what it can prove, and speaks as the agent's own identity. Your repository has each machine as a git remote.">
      <!-- your laptop -->
      <rect class="host" x="2" y="22" width="696" height="408" rx="14" />
      <text class="host-lbl" x="18" y="14">YOUR LAPTOP</text>

      <!-- your things: never inside a machine -->
      <g class="part" :class="{ on: lit(1) }">
        <rect class="yours" x="22" y="56" width="160" height="50" rx="8" />
        <text class="lbl" x="34" y="78">~/src/shop</text>
        <text class="sub" x="34" y="96">your repository</text>
        <rect class="yours" x="22" y="150" width="160" height="66" rx="8" />
        <text class="lbl" x="34" y="176">your keys · your files</text>
        <text class="sub" x="34" y="198">never inside a machine</text>
      </g>

      <!-- the pool: a template, and machines branched from it -->
      <g class="part" :class="{ on: lit(2), fresh: fresh(2) }">
        <rect class="pool" x="232" y="40" width="442" height="212" rx="12" />
        <text class="pool-lbl" x="246" y="60">isx · copy-on-write pool</text>
        <rect class="tpl" x="300" y="72" width="306" height="40" rx="8" />
        <text class="lbl mid" x="453" y="98">tpl-java · the template</text>
        <path v-for="m in machines.filter(m => m.k === 2)" :key="m.name" class="link" :d="`M453 112 C 453 130, ${m.x + 60} 130, ${m.x + 60} 150`" />
        <path class="link" d="M453 112 C 453 130, 310 130, 310 150" />
      </g>
      <g v-for="m in machines" :key="m.name" class="part" :class="{ on: lit(m.k), fresh: fresh(m.k) }">
        <rect class="machine" :x="m.x" y="150" width="120" height="86" rx="10" />
        <text class="lbl mid" :x="m.x + 60" y="178">{{ m.name }}</text>
        <text class="sub mid" :x="m.x + 60" y="200">root inside</text>
        <text class="sub mid" :x="m.x + 60" y="218">nothing of yours</text>
      </g>

      <!-- the proxy: every request out of a machine passes here -->
      <g class="part" :class="{ on: lit(3), fresh: fresh(3) }">
        <path v-for="m in machines" :key="m.name" class="wire" :d="`M${m.x + 60} 236 L ${m.x + 60} 262 L 380 262 L 380 300`" />
        <rect class="proxy" x="250" y="300" width="292" height="110" rx="10" />
        <text class="lbl" x="266" y="326">isx proxy</text>
        <rect class="chip" x="266" y="340" width="112" height="26" rx="5" />
        <text class="chip-t mid" x="322" y="358">cache · asks first</text>
        <path class="wire out" d="M542 336 L 596 336" />
        <rect class="net" x="596" y="300" width="84" height="72" rx="8" />
        <text class="lbl mid" x="638" y="330">the</text>
        <text class="lbl mid" x="638" y="352">internet</text>
      </g>

      <!-- keys: from your side into the proxy, never into a machine -->
      <g class="part" :class="{ on: lit(4), fresh: fresh(4) }">
        <path class="wire key" d="M182 183 C 216 183, 216 330, 250 330" />
        <rect class="chip key" x="388" y="340" width="138" height="26" rx="5" />
        <text class="chip-t mid key" x="457" y="358">keys · added going out</text>
      </g>

      <!-- identity: it speaks as its own account -->
      <g class="part" :class="{ on: lit(5), fresh: fresh(5) }">
        <rect class="chip id" x="266" y="374" width="260" height="26" rx="5" />
        <text class="chip-t mid id" x="396" y="392">speaks as shop-ai-bot, not as you</text>
      </g>

      <!-- git: your repository has the machine as a remote -->
      <g class="part" :class="{ on: lit(6), fresh: fresh(6) }">
        <path class="wire git" d="M182 81 C 216 81, 216 165, 250 165" />
        <text class="git-t" x="26" y="126">git fetch · push agent-1</text>
      </g>
    </svg>

    <div class="side">
      <div class="title" :class="{ on: done }">This is <span class="accent">isx</span>.</div>
      <ol class="ledger">
        <li v-for="(l, i) in ledger" :key="i" :class="{ on: lit(i + 1), fresh: fresh(i + 1) }">
          <span class="p">{{ l.problem }}</span>
          <span class="c">{{ l.choice }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.bp { display: grid; grid-template-columns: 700px 1fr; gap: 36px; align-items: start; }
.draw { width: 700px; height: auto; display: block; overflow: visible; }
.draw text { font-family: 'Inter', system-ui, sans-serif; }
.host { fill: rgba(139, 152, 176, .04); stroke: var(--text-muted); stroke-width: 2; }
.host-lbl { font-size: 12px; font-weight: 700; letter-spacing: .08em; fill: var(--text-muted); }
.lbl { font-size: 15px; font-weight: 600; fill: var(--text); }
.sub { font-size: 12px; fill: var(--text-muted); }
.mid { text-anchor: middle; }
.yours { fill: var(--surface); stroke: var(--line); stroke-width: 1.5; }
.pool { fill: none; stroke: var(--accent-edge); stroke-width: 1.5; stroke-dasharray: 6 5; }
.pool-lbl { font-family: 'JetBrains Mono', monospace !important; font-size: 11px; fill: var(--accent); }
.tpl { fill: var(--surface-2); stroke: var(--accent-edge); stroke-width: 1.5; }
.machine { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2; }
.link { fill: none; stroke: var(--accent-edge); stroke-width: 1.5; }
.proxy { fill: var(--surface-2); stroke: var(--accent); stroke-width: 2; }
.net { fill: var(--surface); stroke: var(--line); stroke-width: 1.5; }
.chip { fill: var(--surface); stroke: var(--accent-edge); }
.chip-t { font-family: 'JetBrains Mono', monospace !important; font-size: 11px; fill: var(--accent); }
.chip.key { stroke: var(--warn); }
.chip-t.key { fill: var(--warn); }
.chip.id { stroke: var(--accent-edge); }
.wire { fill: none; stroke: var(--line); stroke-width: 2; }
.wire.out { stroke: var(--accent); stroke-dasharray: 6 5; }
.wire.key { stroke: var(--warn); stroke-width: 2; stroke-dasharray: 4 4; }
.wire.git { stroke: var(--accent); stroke-width: 2.5; }
.git-t { font-family: 'JetBrains Mono', monospace !important; font-size: 12px; fill: var(--accent); }

.part { opacity: 0; transition: opacity .5s; }
.part.on { opacity: 1; }
.part.fresh .machine, .part.fresh .proxy, .part.fresh .tpl { filter: drop-shadow(0 0 12px rgba(34, 211, 238, .55)); }

.side { padding-top: 6px; }
.title { font-size: 40px; font-weight: 700; color: var(--text); min-height: 52px; opacity: 0; transition: opacity .5s; margin-bottom: 8px; }
.title.on { opacity: 1; }
.ledger { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; counter-reset: n; }
.ledger li { counter-increment: n; display: grid; grid-template-columns: 30px 1fr; row-gap: 2px; opacity: .18; transition: opacity .5s; padding: 0 !important; }
.ledger li::before { content: counter(n); grid-row: span 2; font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--text-muted); padding-top: 3px; }
.ledger li.on { opacity: 1; }
.ledger li .p { font-size: 17px; color: var(--text-muted); line-height: 1.3; }
.ledger li .c { font-size: 19px; font-weight: 600; color: var(--text); line-height: 1.3; }
.ledger li.fresh .c { color: var(--accent); }
</style>
