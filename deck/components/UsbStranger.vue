<script setup lang="ts">
// The read-write share, as the oldest trick in security: a stranger in a
// trench coat, its lining full of USB sticks, holding one out. An original
// flat drawing in the deck's palette, no real person or brand.
// Slide: clicks: 3. Click 1: the second bubble; click 2: its afterthought;
// click 3 is the slide's own caption.
// A photo or render can replace the drawn figure: put it at
// public/img/usb-stranger.jpg (portrait: shown from the top, cropped at the
// waist) and it's used automatically; without it, the drawing stays.
import { onMounted, ref } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()
const photo = `${import.meta.env.BASE_URL}img/usb-stranger.jpg`
const hasPhoto = ref(false)
onMounted(() => {
  const img = new Image()
  img.onload = () => { hasPhoto.value = true }
  img.src = photo
})
// The sticks in the coat's lining, as a grid.
const lining = Array.from({ length: 12 }, (_, i) => ({ x: 132 + (i % 2) * 34, y: 262 + Math.floor(i / 2) * 26 }))
</script>

<template>
  <svg class="usb" viewBox="0 0 1160 456" role="img"
       aria-label="A figure in a fedora, dark glasses and a trench coat holds its coat open, the lining full of USB sticks, and holds one out: 'Psst. Skip the git dance. Just mount it read-write.' Then: 'It's just executable code. Trust me.' And: 'Only some of it was downloaded from the internet.'">
    <!-- a photo or render, when there is one -->
    <template v-if="hasPhoto">
      <clipPath id="usb-photo-clip"><rect x="120" y="4" width="380" height="432" rx="16" /></clipPath>
      <!-- zoomed on the figure: the image (572×1024) drawn 440 wide, hat to coat hem in the frame -->
      <image :href="photo" x="90" y="-186" width="440" height="788" clip-path="url(#usb-photo-clip)" />
      <rect class="photo-frame" x="120" y="4" width="380" height="432" rx="16" />
      <text class="credit" x="500" y="454">Image generated with Google Gemini</text>
    </template>
    <!-- otherwise, the drawing -->
    <g v-else>
    <!-- the coat, one side swung open on a lining full of sticks -->
      <path class="coat" d="M200 196 Q282 178 362 196 L396 436 L200 436 Z" />
      <path class="lining" d="M200 196 L112 246 L124 436 L200 436 Z" />
      <rect v-for="(s, i) in lining" :key="i" class="lined" :x="s.x" :y="s.y" width="26" height="11" rx="2" />
      <path class="flap" d="M200 196 L112 246 L124 436" />
      <path class="belt" d="M200 330 L392 330" />
      <!-- collar up -->
      <path class="collar" d="M226 198 L244 152 L272 212 Z" />
      <path class="collar" d="M334 198 L316 152 L288 212 Z" />
      <!-- the arm, held out -->
      <path class="arm-edge" d="M352 222 Q424 238 486 264" />
      <path class="arm" d="M352 222 Q424 238 486 264" />
      <!-- head: hat brim low, glasses dark, a sideways smile -->
      <ellipse class="face" cx="280" cy="136" rx="44" ry="50" />
      <rect class="shades" x="242" y="124" width="76" height="17" rx="7" />
      <path class="glint" d="M300 128 L312 128" />
      <path class="smirk" d="M262 164 Q282 176 300 160" />
      <path class="stubble" d="M252 170 l2 2 M262 178 l2 2 M276 182 l2 2 M292 180 l2 2 M304 172 l2 2" />
      <path class="crown" d="M226 96 Q230 44 280 42 Q330 44 334 96 Z" />
      <rect class="band" x="228" y="80" width="104" height="12" />
      <ellipse class="brim" cx="280" cy="98" rx="98" ry="15" />
      <!-- the hand, and the stick -->
      <circle class="hand" cx="492" cy="266" r="18" />
      <rect class="stick" x="504" y="250" width="118" height="32" rx="6" />
      <rect class="plug" x="622" y="256" width="28" height="20" rx="2" />
      <text class="stick-lbl" x="563" y="272">rw</text>
      <text class="tag" x="504" y="314">your repo</text>
    </g>

    <!-- the offer -->
    <path class="bubble" d="M560 36 H1120 Q1140 36 1140 56 V166 Q1140 186 1120 186 H620 L540 226 L580 186 H560 Q540 186 540 166 V56 Q540 36 560 36 Z" />
    <text class="say" x="572" y="96">Psst. Skip the git dance.</text>
    <text class="say" x="572" y="150">Just mount it read-write.</text>

    <!-- the small print -->
    <g class="reveal" :class="{ on: $clicks >= 1 }">
      <path class="bubble" d="M822 222 H1120 Q1140 222 1140 242 V410 Q1140 430 1120 430 H822 Q802 430 802 410 V312 L744 290 L802 272 V242 Q802 222 822 222 Z" />
      <text class="small-say" x="828" y="266">It's just…</text>
      <text class="small-say" x="828" y="302"><tspan class="irony">executable code</tspan>.</text>
      <text class="small-say strong" x="828" y="340">Trust me.</text>
      <g class="reveal" :class="{ on: $clicks >= 2 }">
        <text class="small-say" x="828" y="380">Only some of it came</text>
        <text class="small-say" x="828" y="414">from <tspan class="irony">the internet</tspan>.</text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.credit { font-family: 'Inter', system-ui, sans-serif; font-size: 13px; fill: var(--text-muted); text-anchor: end; }
.photo-frame { fill: none; stroke: var(--line); stroke-width: 2; }
.usb { width: 100%; height: auto; display: block; overflow: visible; }
.coat { fill: #4a3f2c; stroke: #75633f; stroke-width: 3; }
.lining { fill: #3a1624; stroke: #75633f; stroke-width: 3; }
.flap { fill: none; stroke: #8a764c; stroke-width: 4; }
.lined { fill: var(--warn); opacity: .9; }
.belt { stroke: #2d261a; stroke-width: 10; }
.collar { fill: #5a4d35; stroke: #75633f; stroke-width: 2; }
.arm-edge { fill: none; stroke: #75633f; stroke-width: 42; stroke-linecap: round; }
.arm { fill: none; stroke: #4a3f2c; stroke-width: 36; stroke-linecap: round; }
.face { fill: #26324a; }
.shades { fill: #02040a; stroke: var(--text-muted); stroke-width: 1.5; }
.glint { stroke: var(--text); stroke-width: 2.5; stroke-linecap: round; }
.smirk { fill: none; stroke: var(--text-muted); stroke-width: 3; stroke-linecap: round; }
.stubble { stroke: var(--text-muted); stroke-width: 2; opacity: .6; }
.crown { fill: #2d261a; stroke: #75633f; stroke-width: 2.5; }
.band { fill: #120e08; }
.brim { fill: #2d261a; stroke: #75633f; stroke-width: 2.5; }
.hand { fill: #3a4660; stroke: var(--line); stroke-width: 2; }
.stick { fill: var(--warn); }
.plug { fill: var(--text-muted); }
.stick-lbl { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; fill: var(--bg); text-anchor: middle; }
.tag { font-family: 'JetBrains Mono', monospace; font-size: 17px; fill: var(--warn); }
.bubble { fill: var(--surface); stroke: var(--warn); stroke-width: 2.5; stroke-linejoin: round; }
.say { font-family: 'Inter', system-ui, sans-serif; font-size: 40px; font-weight: 700; fill: var(--text); }
.small-say { font-family: 'Inter', system-ui, sans-serif; font-size: 28px; font-weight: 600; fill: var(--text); }
.irony { fill: var(--danger); font-weight: 800; }
.small-say.strong { font-weight: 800; fill: var(--warn); }
.reveal { opacity: 0; transition: opacity .5s; }
.reveal.on { opacity: 1; }
</style>
