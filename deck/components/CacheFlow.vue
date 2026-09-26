<script setup lang="ts">
// The proxy's artifact cache, one case per click (slide: clicks: 5). Each
// row is the same three boxes, agent → proxy (with its cache) → Maven
// Central, and shows what one kind of request does. The rule that ties them
// together, from incus-spawn #792: a cached artifact is served only when a
// fresh download would return the same bytes.
//  1. metadata, SNAPSHOTs, private repositories: straight through, never cached
//  2. a release jar, first time: downloaded once, stored only if the bytes
//     match the checksum upstream sent with them
//  3. the same jar again: one HEAD asks Central for its checksum; a match
//     serves the stored copy, so the bytes never travel twice
//  4. Central changed or withdrew it: the checksum differs, the copy is
//     evicted, the request goes upstream
//  5. Central unreachable: the copy is served unconfirmed, and only then
// Static renders show every row. The newest row's wires march.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks, $renderContext } = useSlideContext()
const live = computed(() => ['slide', 'presenter'].includes($renderContext.value))

type Row = {
  req: string; sub?: string
  up: 'through' | 'get' | 'head' | 'none'      // what goes to Central
  serve: 'upstream' | 'cache' | 'cache-warn'    // where the agent's bytes come from
  cache: 'none' | 'store' | 'ok' | 'evict' | 'warn'
  l1: string; l2: string; noteKind: 'muted' | 'accent' | 'warn'
}
const rows: Row[] = [
  { req: 'metadata · -SNAPSHOT', sub: 'private repositories', up: 'through', serve: 'upstream', cache: 'none', l1: 'never cached:', l2: 'it can change, or it isn\'t public', noteKind: 'muted' },
  { req: 'lib-1.2.jar', sub: 'first time', up: 'get', serve: 'upstream', cache: 'store', l1: 'downloaded once; stored only if the bytes', l2: 'match the checksum upstream sent with them', noteKind: 'accent' },
  { req: 'lib-1.2.jar', sub: 'again', up: 'head', serve: 'cache', cache: 'ok', l1: 'one HEAD confirms the checksum,', l2: 'and the download never travels twice', noteKind: 'accent' },
  { req: 'lib-1.2.jar', sub: 'but Central changed or withdrew it', up: 'head', serve: 'upstream', cache: 'evict', l1: 'checksum differs: evicted, fetched fresh.', l2: 'A stale copy is never served', noteKind: 'accent' },
  { req: 'lib-1.2.jar', sub: 'Central unreachable', up: 'none', serve: 'cache-warn', cache: 'warn', l1: 'served unconfirmed,', l2: 'and only while upstream can\'t be reached', noteKind: 'warn' },
]
const ROW = 60
const y = (i: number) => i * ROW
const on = (i: number) => $clicks.value >= i + 1
const newest = (i: number) => live.value && $clicks.value === i + 1
</script>

<template>
  <svg class="cf" :viewBox="`0 0 1160 ${rows.length * ROW}`" role="img"
       aria-label="Five kinds of request through the proxy's cache: metadata and SNAPSHOTs are never cached; a release jar is stored on first download only if it matches upstream's checksum; a repeat request confirms the checksum with one HEAD and serves the stored copy; a changed or withdrawn artifact is evicted and fetched fresh; when Central is unreachable the copy is served unconfirmed.">
    <!-- column heads -->
    <text class="head" x="297" y="-10" text-anchor="middle">agent-1</text>
    <text class="head" x="500" y="-10" text-anchor="middle">proxy · cache</text>
    <text class="head" x="715" y="-10" text-anchor="middle">Maven Central</text>

    <g v-for="(r, i) in rows" :key="i" class="row" :class="{ on: on(i), live: newest(i) }" :transform="`translate(0 ${y(i)})`">
      <!-- the request -->
      <text class="req" x="0" y="26">{{ r.req }}</text>
      <text v-if="r.sub" class="sub" x="0" y="46">{{ r.sub }}</text>

      <!-- agent -->
      <rect class="box" x="262" y="12" width="70" height="34" rx="6" />
      <!-- agent ↔ proxy: the reply, from upstream or from the cache -->
      <path class="wire reply" :class="r.serve" d="M332 29 L 420 29" />
      <!-- proxy with its cache drawer -->
      <rect class="box proxy" x="420" y="6" width="160" height="46" rx="8" />
      <rect class="drawer" :class="r.cache" x="500" y="14" width="70" height="30" rx="5" />
      <text class="drawer-t" :class="r.cache" x="535" y="34" text-anchor="middle">{{ { none: '—', store: '✓ sha1', ok: '✓ sha1', evict: '✗ sha1', warn: '? sha1' }[r.cache] }}</text>
      <!-- proxy ↔ Central -->
      <template v-if="r.up !== 'none'">
        <path class="wire up" :class="r.up" d="M580 29 L 680 29" />
        <text v-if="r.up === 'head'" class="tag" x="630" y="18" text-anchor="middle">HEAD</text>
        <text v-else class="tag" x="630" y="18" text-anchor="middle">GET</text>
      </template>
      <template v-else>
        <path class="wire cut" d="M580 29 L 625 29" />
        <text class="x" x="636" y="35" text-anchor="middle">✗</text>
      </template>
      <rect class="box" :class="{ gone: r.up === 'none' }" x="680" y="12" width="70" height="34" rx="6" />

      <!-- the verdict -->
      <text class="note" :class="r.noteKind" x="772" y="24">{{ r.l1 }}</text>
      <text class="note" :class="r.noteKind" x="772" y="44">{{ r.l2 }}</text>
    </g>
  </svg>
</template>

<style scoped>
.cf { width: 100%; height: auto; display: block; overflow: visible; }
.cf text { font-family: 'Inter', system-ui, sans-serif; }
.head { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; fill: var(--text-muted); }
.req, .sub, .drawer-t, .tag { font-family: 'JetBrains Mono', monospace !important; }
.req { font-size: 15px; fill: var(--text); }
.sub { font-size: 12px; fill: var(--text-muted); }
.note { font-size: 14px; fill: var(--text); }
.note.muted { fill: var(--text-muted); }
.note.accent { fill: var(--accent); }
.note.warn { fill: var(--warn); }

.box { fill: var(--surface-2); stroke: var(--line); stroke-width: 1.5; }
.box.proxy { stroke: var(--accent-edge); }
.box.gone { fill: none; stroke-dasharray: 5 4; opacity: .5; }
.drawer { fill: var(--surface); stroke: var(--line); }
.drawer.store, .drawer.ok { stroke: var(--accent); fill: var(--accent-soft); }
.drawer.evict { stroke: var(--danger); fill: rgba(255, 77, 109, .10); }
.drawer.warn { stroke: var(--warn); fill: rgba(245, 165, 36, .10); }
.drawer-t { font-size: 12px; fill: var(--text-muted); }
.drawer-t.store, .drawer-t.ok { fill: var(--accent); }
.drawer-t.evict { fill: var(--danger); }
.drawer-t.warn { fill: var(--warn); }
.tag { font-size: 11px; fill: var(--text-muted); }
.x { font-size: 16px; font-weight: 700; fill: var(--danger); }

.wire { fill: none; stroke-width: 2.5; stroke: var(--line); }
.wire.up.through, .wire.up.get { stroke: var(--text-muted); }
.wire.up.head { stroke: var(--text-muted); stroke-width: 1.5; stroke-dasharray: 3 4; }
.wire.reply.upstream { stroke: var(--text-muted); }
.wire.reply.cache { stroke: var(--accent); stroke-width: 4; }
.wire.reply.cache-warn { stroke: var(--warn); stroke-width: 4; }
.wire.cut { stroke: var(--danger); stroke-dasharray: 5 4; }
.row.live .wire:not(.cut) { stroke-dasharray: 8 6; animation: march 1s linear infinite; }
.row.live .wire.up.head { stroke-dasharray: 3 4; animation: march .7s linear infinite; }
@keyframes march { to { stroke-dashoffset: -14; } }

.row { opacity: 0; transition: opacity .45s; }
.row.on { opacity: 1; }
</style>
