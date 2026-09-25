<script setup lang="ts">
// An original drawing, in homage to Homer's drinking bird ("King-Size Homer",
// The Simpsons, 1995): the bird tips onto the Y key forever. The fallback for
// HomerFrames when the original frames haven't been fetched.
</script>

<template>
  <div class="scene">
    <svg viewBox="0 0 520 420" class="bird" role="img" aria-label="A drinking bird endlessly tipping forward to press the Y key">
      <!-- the desk and the key -->
      <rect class="desk" x="10" y="380" width="500" height="10" rx="4" />
      <g class="key">
        <rect x="262" y="306" width="84" height="74" rx="10" />
        <text x="304" y="355">Y</text>
      </g>

      <!-- the stand -->
      <path class="stand" d="M150 380 L190 232 L230 380" />
      <circle class="pivot" cx="190" cy="232" r="6" />

      <!-- the bird, tipping around the pivot -->
      <g class="body">
        <line class="neck" x1="190" y1="300" x2="190" y2="120" />
        <circle class="bulb" cx="190" cy="318" r="42" />
        <circle class="head" cx="190" cy="104" r="30" />
        <path class="beak" d="M216 98 L262 108 L216 116 Z" />
        <rect class="hat-brim" x="152" y="72" width="76" height="8" rx="3" />
        <rect class="hat" x="166" y="40" width="48" height="36" rx="4" />
        <circle class="eye" cx="200" cy="96" r="4" />
      </g>
    </svg>

  </div>
</template>

<style scoped>
.scene { display: flex; justify-content: center; }
.bird { width: 420px; height: auto; }

.desk { fill: var(--line); }
.key rect { fill: var(--surface-2); stroke: var(--text-muted); stroke-width: 2; }
.key text { font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 700; fill: var(--text); text-anchor: middle; }
.key { animation: press 2.4s infinite; transform-origin: 304px 380px; }

.stand { fill: none; stroke: var(--text-muted); stroke-width: 5; stroke-linejoin: round; }
.pivot { fill: var(--text-muted); }

.body { transform-origin: 190px 232px; animation: dip 2.4s infinite; }
.neck { stroke: rgba(34, 211, 238, 0.55); stroke-width: 10; stroke-linecap: round; }
.bulb { fill: rgba(255, 77, 109, 0.35); stroke: var(--danger); stroke-width: 3; }
.head { fill: var(--danger); }
.beak { fill: var(--warn); }
.hat, .hat-brim { fill: var(--surface-2); stroke: var(--text-muted); stroke-width: 2; }
.eye { fill: var(--bg); }

/* Slow tip forward, a tap on the key, a quick swing back. */
@keyframes dip {
  0%   { transform: rotate(-8deg); }
  66%  { transform: rotate(92deg); }
  72%  { transform: rotate(95deg); }
  100% { transform: rotate(-8deg); }
}
@keyframes press {
  0%, 64%   { transform: translateY(0); }
  70%       { transform: translateY(6px); }
  78%, 100% { transform: translateY(0); }
}

</style>
