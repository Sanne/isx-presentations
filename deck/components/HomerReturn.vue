<script setup lang="ts">
// What Homer comes back to, over the top of the game once the room has
// played the drinking bird: the plant's terminal, "SITUATION CRITICAL.
// EXPLOSION IMMINENT." Shown by v-click on the slide. If the frame isn't
// on disk (see tools/fetch-memes.sh), the screen's text stands in for it.
import { ref } from 'vue'

const base = import.meta.env.BASE_URL
const missing = ref(false)
</script>

<template>
  <div class="back" data-overlay>
    <figure>
      <img v-if="!missing" :src="`${base}memes/homer-1062478.jpg`" alt="Situation critical. Explosion imminent." @error="missing = true">
      <div v-else class="screen">SITUATION CRITICAL.<br>EXPLOSION IMMINENT.</div>
      <figcaption>3. Come back to this</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.back {
  position: absolute; inset: 0; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  background: rgba(7, 11, 20, .88);
}
figure { margin: 0; text-align: center; animation: in .6s ease-out; }
img { height: 440px; width: auto; border-radius: 10px; border: 1px solid var(--line); box-shadow: 0 0 60px -10px var(--danger); display: block; }
.screen {
  width: 580px; height: 440px; border-radius: 10px; border: 2px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: 34px; line-height: 1.5; color: #7dff8a;
  background: #0a1a0c; box-shadow: 0 0 60px -10px var(--danger);
}
figcaption { margin-top: 14px; font-size: 24px; font-weight: 600; color: var(--danger); }
@keyframes in { from { opacity: 0; transform: scale(.94); } }
</style>
