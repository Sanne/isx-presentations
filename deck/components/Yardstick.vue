<script setup lang="ts">
// The three questions the whole talk answers. Reappears at the end of each
// act with one more box ticked; `why` lists the reasons the new tick was
// earned, one per click, and the box ticks only on the click after the last
// reason (slide: clicks = why.length + 1), so the tick is never just
// asserted. Pass an empty `why` to show the new tick at once, when the slides
// just before it already made the case.
import { useSlideContext } from '@slidev/client'

const props = defineProps<{ done: number; why?: string[] }>()
const { $clicks } = useSlideContext()
// The question this slide answers is ticked once its reasons are all shown.
const ticked = (i: number) => i < props.done - 1 || (i === props.done - 1 && (!props.why?.length || $clicks.value > props.why.length))

const questions = [
  'Can I leave it alone?',
  'Can I run five at once?',
  'Can I trust its work?',
]
</script>

<template>
  <div class="wrap">
    <ul class="yardstick">
      <li v-for="(q, i) in questions" :key="q" :class="{ done: ticked(i), current: why && i === done - 1 }">
        <span class="box">{{ ticked(i) ? '✓' : '' }}</span>{{ q }}
      </li>
    </ul>
    <ul v-if="why?.length" class="why">
      <li v-for="(w, i) in why" :key="w" :class="{ on: $clicks >= i + 1 }">{{ w }}</li>
    </ul>
  </div>
</template>

<style scoped>
.wrap { display: inline-flex; flex-direction: column; gap: 34px; text-align: left; }
.yardstick { display: flex; flex-direction: column; gap: 18px; }
.yardstick li { padding: 0 !important; font-size: 40px !important; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 22px; }
.yardstick li::before { content: none !important; }
.yardstick li.done { color: var(--text); }
.yardstick li.current { color: var(--accent); }
.box {
  width: 44px; height: 44px; flex: none;
  border: 2px solid var(--line); border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 30px; color: var(--bg);
}
.box { transition: background .3s, border-color .3s, box-shadow .3s; }
.current .box { border-color: var(--accent); }
.done .box { background: var(--accent); border-color: var(--accent); box-shadow: var(--glow); }
.current.done .box { animation: tick .45s ease-out; }
@keyframes tick { 0% { transform: scale(1.5); } 100% { transform: scale(1); } }

.why { padding-left: 66px !important; display: flex; flex-direction: column; gap: 6px; }
.why li { font-size: 24px !important; color: var(--text-muted); opacity: 0; transition: opacity .45s; }
.why li.on { opacity: 1; }
</style>
