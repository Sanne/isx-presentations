<script setup lang="ts">
// Frames from "King-Size Homer" (The Simpsons, 1995), one per click: the
// stick that replaces his finger, the drinking bird that automates it, and
// what he comes back to. `show` picks which; the third is usually kept for
// HomerReturn, after the audience has played the drinking bird themselves. The frames aren't in the repository (see
// tools/fetch-memes.sh); if any is missing, the slide falls back to an
// original drawing of the drinking bird. Slide: clicks: show.length - 1
import { computed, ref } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{ show?: number[] }>(), { show: () => [0, 1, 2] })
const { $clicks } = useSlideContext()
const base = import.meta.env.BASE_URL
const all = [
  { t: 929220, caption: 'Replace your finger' },
  { t: 978436, caption: 'Automate it' },
  { t: 1062478, caption: 'Come back to this', bad: true },
]
const frames = computed(() => props.show.map(i => all[i]))
const missing = ref(false)
</script>

<template>
  <div v-if="!missing" class="homer" :style="{ gridTemplateColumns: `repeat(${frames.length}, 1fr)` }">
    <figure v-for="(f, i) in frames" :key="f.t" :class="{ on: $clicks >= i }">
      <img :src="`${base}memes/homer-${f.t}.jpg`" :alt="f.caption" @error="missing = true">
      <figcaption :class="{ bad: f.bad }">{{ show[i] + 1 }}. {{ f.caption }}</figcaption>
    </figure>
  </div>
  <DrinkingBird v-else />
</template>

<style scoped>
.homer { display: grid; gap: 16px; }
figure { margin: 0; opacity: 0; transform: translateY(8px); transition: opacity .5s, transform .5s; }
figure.on { opacity: 1; transform: none; }
img { width: 100%; max-height: 360px; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; display: block; border: 1px solid var(--line); }
figcaption { margin-top: 8px; font-size: 20px; font-weight: 600; color: var(--text); }
figcaption.bad { color: var(--danger); }
</style>
