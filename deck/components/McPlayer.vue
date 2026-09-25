<script setup lang="ts">
// Embeds a Motion Canvas project built by `npm run build:anim`.
// Mounted only while its slide is on screen, so the clip starts from
// the beginning when you arrive instead of mid-way through.
import '@motion-canvas/player'
import { onBeforeUnmount, ref, watch } from 'vue'
import { useIsSlideActive } from '@slidev/client'

const props = defineProps<{ src: string }>()
const active = useIsSlideActive()
const frame = ref<HTMLDivElement>()

// Built by hand rather than in the template, for two reasons:
// - the player exposes `auto` as a read-only property, so Vue's prop
//   binding throws; it has to be a real attribute;
// - it import()s `src` itself, and in dev Vite rewrites a root-relative
//   dynamic import into a module request that 500s on a public/ file.
//   An absolute URL is left alone.
function mount() {
  const el = document.createElement('motion-canvas-player')
  const base = location.origin + import.meta.env.BASE_URL
  el.setAttribute('src', new URL(props.src.replace(/^\//, ''), base).href)
  // The player tests `!!getAttribute('auto')`, so a bare attribute is off.
  el.setAttribute('auto', 'true')
  frame.value!.replaceChildren(el)
}

watch(active, on => (on ? mount() : frame.value?.replaceChildren()), { flush: 'post' })
watch(frame, f => f && active.value && mount())
onBeforeUnmount(() => frame.value?.replaceChildren())
</script>

<template>
  <div ref="frame" class="mc-frame" />
</template>

<style scoped>
.mc-frame {
  /* 16:9 at the height that fits under a slide heading. */
  height: 540px;
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg);
}
.mc-frame :deep(motion-canvas-player) { display: block; width: 100%; height: 100%; }
</style>
