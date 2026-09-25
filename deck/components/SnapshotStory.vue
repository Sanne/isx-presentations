<script setup lang="ts">
// The shared-SNAPSHOT story as a timeline, one row per click: agent A's
// installs on the left, what's in the shared ~/.m2 in the middle, and agent
// B's flaky-test hunt on the right. The middle column only makes sense in
// hindsight, which is the point.
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()

const rows = [
  { when: 'Tue – Wed', a: '', m2: 'lib-1.2-SNAPSHOT', m2Kind: 'clean', b: 'Hunting a race: fails 1 run in 50. Collecting clues: logs, thread dumps, timings', bKind: '' },
  { when: 'Thu 14:05', a: 'Other task. Patches lib, runs mvn install', m2: "A's patch #1", m2Kind: 'dirty', b: '', bKind: '' },
  { when: 'Thu 14:20', a: '', m2: "A's patch #1", m2Kind: 'dirty', b: '0 failures in 200 runs. "It was the pool timeout I raised." Writes it up, commits the fix', bKind: 'good' },
  { when: 'Thu 15:40', a: 'Tries another idea, mvn install again', m2: "A's patch #2", m2Kind: 'dirty', b: '', bKind: '' },
  { when: 'Thu 15:55', a: '', m2: "A's patch #2", m2Kind: 'dirty', b: 'Fails 1 run in 12. The theory collapses; two days of clues now point the wrong way', bKind: 'bad' },
]
</script>

<template>
  <div class="story">
    <div class="head">
      <span />
      <span>Agent A <small>worktree: cache-tuning</small></span>
      <span class="mid">~/.m2 <small>shared</small></span>
      <span>Agent B <small>worktree: race-condition</small></span>
    </div>
    <div v-for="(r, i) in rows" :key="i" class="row" :class="{ on: $clicks >= i }">
      <span class="when">{{ r.when }}</span>
      <span class="col-a">{{ r.a }}</span>
      <span class="m2" :class="[r.m2Kind, { reveal: $clicks >= rows.length }]">{{ r.m2 }}</span>
      <span class="col-b" :class="r.bKind">{{ r.b }}</span>
    </div>
  </div>
</template>

<style scoped>
.story { display: flex; flex-direction: column; gap: 6px; }
.head, .row {
  display: grid;
  grid-template-columns: 130px 1fr 230px 1fr;
  gap: 18px;
  align-items: center;
}
.head { font-size: 17px; font-weight: 600; color: var(--text); padding-bottom: 6px; border-bottom: 2px solid var(--line); }
.head small { display: block; font-weight: 400; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 14px; }
.head .mid { text-align: center; }

.row { padding: 6px 0; border-bottom: 1px solid var(--line); opacity: 0; transform: translateY(6px); transition: opacity .45s, transform .45s; }
.row.on { opacity: 1; transform: none; }
.when { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--text-muted); }
/* Not .a/.b: UnoCSS reads a bare `b` class as its border utility. */
.col-a, .col-b { font-size: 18px; line-height: 1.3; color: var(--text); }
.col-b.good { color: var(--accent); }
.col-b.bad  { color: var(--danger); }

/* The shared ~/.m2 stays deliberately quiet until the last click, when the
   audience is told where to look: then A's patches light up. */
.m2 {
  text-align: center;
  font-family: 'JetBrains Mono', monospace; font-size: 15px;
  padding: 6px 8px; border-radius: 6px;
  border: 1px solid var(--line); color: var(--text-muted);
  transition: color .5s, border-color .5s, box-shadow .5s;
}
.m2.dirty.reveal { color: var(--danger); border-color: var(--danger); box-shadow: 0 0 14px -6px var(--danger); }
</style>
