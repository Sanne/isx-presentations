<script setup lang="ts">
// Plays a scene from scenes/index.ts in a mock terminal, one step per click.
// The slide sets `clicks:` to steps.length - 1. Old lines scroll off the top,
// like a real session.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { scenes, type Line } from '../scenes'

const props = defineProps<{ scene: string }>()
const { $clicks } = useSlideContext()

const scene = computed(() => {
  const s = scenes[props.scene]
  if (!s) throw new Error(`Unknown scene: ${props.scene}`)
  return s
})

const visible = computed(() => {
  const shown = scene.value.steps.slice(0, $clicks.value + 1).flat()
  // A prompt is still waiting until the session moves on past it. The
  // narrator's notes don't count: time passing is exactly when it waits.
  const types = shown.map(l => l.t)
  const lastActive = types.findLastIndex(t => t !== 'note')
  return shown.map((line, i) => ({ line, waiting: line.t === 'ask' && i === lastActive }))
})

const approvals = computed(() =>
  visible.value.filter(({ line, waiting }) => line.t === 'ask' && !waiting).length)

const prefix: Record<Line['t'], string> = {
  user: '>', agent: '●', run: '$', ask: '?', out: '', err: '✗', note: '',
}
</script>

<template>
  <div class="term">
    <div class="bar">
      <span class="dots"><i /><i /><i /></span>
      <span class="title">{{ scene.title }}</span>
      <span v-if="scene.counter" class="counter" :class="{ some: approvals > 0 }">
        approvals: {{ approvals }}
      </span>
    </div>
    <div class="screen">
      <div class="lines">
        <template v-for="({ line, waiting }, i) in visible" :key="i">
          <div v-if="line.t === 'ask' && waiting" class="prompt">
            <div class="prompt-head">Allow this command?<span v-if="line.why" class="why"> — {{ line.why }}</span></div>
            <div class="prompt-cmd">{{ line.text }}</div>
            <div class="prompt-opts"><b>❯ 1. Yes</b><span>2. Yes, and don't ask again</span><span>3. No</span></div>
          </div>
          <div v-else-if="line.t === 'ask'" class="line answered">
            <span class="pfx">✓</span>you allowed <code>{{ line.text }}</code><span v-if="line.why" class="why"> — {{ line.why }}</span>
          </div>
          <div v-else class="line" :class="line.t">
            <span v-if="prefix[line.t]" class="pfx">{{ prefix[line.t] }}</span>{{ line.text }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.term {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  font-family: 'JetBrains Mono', monospace;
}
.bar {
  display: flex; align-items: center; gap: 14px;
  padding: 10px 16px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--line);
  font-size: 15px; color: var(--text-muted);
}
.dots { display: inline-flex; gap: 7px; }
.dots i { width: 11px; height: 11px; border-radius: 50%; background: var(--line); display: block; }
.title { flex: 1; }
.counter { padding: 2px 10px; border-radius: 4px; border: 1px solid var(--line); }
.counter.some { color: var(--warn); border-color: var(--warn); }

/* Fixed height; lines stack from the bottom so older ones scroll away. */
.screen {
  height: 420px;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 14px 20px 18px;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent 0, #000 48px);
}
.lines { display: flex; flex-direction: column; gap: 7px; }

.line { font-size: 18px; line-height: 1.45; color: var(--text); white-space: pre-wrap; }
.pfx { display: inline-block; width: 1.4em; color: var(--accent); }
.user { color: var(--text); font-weight: 700; }
.agent .pfx { font-size: 0.8em; }
.run { color: var(--text-muted); }
.run .pfx { color: var(--text-muted); }
.out { color: var(--text-muted); padding-left: 1.4em; }
.err { color: var(--danger); }
.err .pfx { color: var(--danger); }
.note { color: var(--warn); font-family: 'Inter', sans-serif; font-style: italic; font-size: 20px; padding-left: 1.4em; margin-top: 4px; }
.answered { color: var(--text-muted); font-size: 16px; }
.answered .pfx { color: var(--warn); }
.answered code { color: var(--text); }
.why { color: var(--text-muted); font-size: 0.9em; }

.prompt {
  border: 1px solid var(--warn);
  border-radius: 8px;
  padding: 10px 14px;
  margin: 4px 0;
  box-shadow: 0 0 18px -8px var(--warn);
}
.prompt-head { color: var(--warn); font-size: 16px; }
.prompt-cmd { color: var(--text); font-size: 18px; margin: 6px 0; }
.prompt-opts { color: var(--text-muted); font-size: 15px; display: flex; gap: 28px; }
.prompt-opts b { color: var(--text); font-weight: 700; animation: blink 1.1s steps(2, start) infinite; }
@keyframes blink { to { opacity: 0.35; } }
</style>
