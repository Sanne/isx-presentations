<script setup lang="ts">
// The proxy's artifact cache, one case per row, in two groups by protocol
// (slide: clicks: 6). Each row is the same three boxes, agent → proxy (with
// its cache drawer) → upstream, and shows what one kind of request does.
// The rule that ties them together: a cached artifact is served only when a
// fresh download would return the same bytes. How that is checked depends
// on what the request names.
//  Maven Central (incus-spawn #792): the request names a coordinate, not
//  the bytes, so every hit asks upstream for its checksum (one HEAD).
//   1. metadata, SNAPSHOTs, private repositories: never cached
//   2. a release jar, first time: stored only if it matches upstream's checksum
//   3. the same jar again: one HEAD confirms the checksum, served from disk
//   4. upstream changed or withdrew it: evicted, fetched fresh
//   5. upstream unreachable: served unconfirmed, and only then
//  OCI registries (MitmProxy: blobs by digest): the request names the bytes.
//   6. manifests, tags, tokens: never cached; a blob by sha256 digest: verified
//      against the digest on store, then served from disk with nothing to ask
// Static renders show every row. The newest rows' wires march.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks, $renderContext } = useSlideContext()
const live = computed(() => ['slide', 'presenter'].includes($renderContext.value))

type Row = {
  step: number; group?: string; groupSub?: string
  req: string; sub?: string
  up: 'through' | 'get' | 'head' | 'none'      // what goes upstream
  serve: 'upstream' | 'cache' | 'cache-warn'    // where the agent's bytes come from
  cache: 'none' | 'store' | 'ok' | 'evict' | 'warn'
  l1: string; l2: string; noteKind: 'muted' | 'accent' | 'warn'
}
const rows: Row[] = [
  { step: 1, group: 'Maven Central', groupSub: 'the request names a coordinate, not the bytes: so every hit asks',
    req: 'metadata · -SNAPSHOT', sub: 'private repositories', up: 'through', serve: 'upstream', cache: 'none', l1: 'never cached:', l2: 'it can change, or it isn\'t public', noteKind: 'muted' },
  { step: 2, req: 'lib-1.2.jar', sub: 'first time', up: 'get', serve: 'upstream', cache: 'store', l1: 'downloaded once; stored only if the bytes', l2: 'match the checksum upstream sent with them', noteKind: 'accent' },
  { step: 3, req: 'lib-1.2.jar', sub: 'again', up: 'head', serve: 'cache', cache: 'ok', l1: 'one HEAD confirms the checksum,', l2: 'and the download never travels twice', noteKind: 'accent' },
  { step: 4, req: 'lib-1.2.jar', sub: 'but Central changed or withdrew it', up: 'head', serve: 'upstream', cache: 'evict', l1: 'checksum differs: evicted, fetched fresh.', l2: 'A stale copy is never served', noteKind: 'accent' },
  { step: 5, req: 'lib-1.2.jar', sub: 'Central unreachable', up: 'none', serve: 'cache-warn', cache: 'warn', l1: 'served unconfirmed,', l2: 'and only while upstream can\'t be reached', noteKind: 'warn' },
  { step: 6, group: 'OCI registries', groupSub: 'Docker Hub, GHCR, Quay: the request names the bytes, so a hit has nothing to ask',
    req: 'manifests · tags · tokens', up: 'through', serve: 'upstream', cache: 'none', l1: 'never cached:', l2: 'a tag can move', noteKind: 'muted' },
  { step: 6, req: 'blobs/sha256:3f2a91c…', sub: 'a layer, by its digest', up: 'get', serve: 'cache', cache: 'ok', l1: 'stored only if the bytes hash to the digest;', l2: 'then served from disk: the name is the checksum', noteKind: 'accent' },
]
const ROW = 43, GROUP = 30
// Row tops, with room above each group's header.
const tops = rows.reduce<number[]>((acc, r, i) => [...acc, (i ? acc[i - 1] + ROW : 0) + (r.group ? GROUP : 0)], [])
const height = tops[tops.length - 1] + ROW
const on = (r: Row) => $clicks.value >= r.step
const newest = (r: Row) => live.value && $clicks.value === r.step
</script>

<template>
  <svg class="cf" :viewBox="`0 0 1160 ${height}`" role="img"
       aria-label="Requests through the proxy's cache, by protocol. Maven Central: metadata and SNAPSHOTs are never cached; a release jar is stored on first download only if it matches upstream's checksum; a repeat request confirms the checksum with one HEAD and serves the stored copy; a changed or withdrawn artifact is evicted and fetched fresh; when Central is unreachable the copy is served unconfirmed. OCI registries: manifests and tags are never cached; a blob requested by digest is verified against it on store, then served from disk with nothing to ask.">
    <text class="head" x="297" y="-8" text-anchor="middle">agent-1</text>
    <text class="head" x="500" y="-8" text-anchor="middle">proxy · cache</text>
    <text class="head" x="715" y="-8" text-anchor="middle">upstream</text>

    <g v-for="(r, i) in rows" :key="i" class="row" :class="{ on: on(r), live: newest(r) }" :transform="`translate(0 ${tops[i]})`">
      <!-- the group this row opens -->
      <template v-if="r.group">
        <text class="group" x="0" y="-11">{{ r.group }}</text>
        <text class="group-sub" x="0" y="-11"><tspan :x="r.group.length * 11.5 + 8">{{ r.groupSub }}</tspan></text>
        <line class="rule" x1="0" y1="-4" x2="1160" y2="-4" />
      </template>

      <!-- the request -->
      <text class="req" x="0" :y="r.sub ? 20 : 27">{{ r.req }}</text>
      <text v-if="r.sub" class="sub" x="0" y="38">{{ r.sub }}</text>

      <!-- agent -->
      <rect class="box" x="262" y="8" width="70" height="30" rx="6" />
      <!-- agent ↔ proxy: the reply, from upstream or from the cache -->
      <path class="wire reply" :class="r.serve" d="M332 23 L 420 23" />
      <!-- proxy with its cache drawer -->
      <rect class="box proxy" x="420" y="3" width="160" height="40" rx="8" />
      <rect class="drawer" :class="r.cache" x="500" y="9" width="70" height="28" rx="5" />
      <text class="drawer-t" :class="r.cache" x="535" y="28" text-anchor="middle">{{ { none: '—', store: '✓ sha1', ok: r.step === 6 ? '✓ sha256' : '✓ sha1', evict: '✗ sha1', warn: '? sha1' }[r.cache] }}</text>
      <!-- proxy ↔ upstream -->
      <template v-if="r.up !== 'none'">
        <path class="wire up" :class="r.up" d="M580 23 L 680 23" />
        <text class="tag" x="630" y="13" text-anchor="middle">{{ r.up === 'head' ? 'HEAD' : 'GET' }}</text>
      </template>
      <template v-else>
        <path class="wire cut" d="M580 23 L 625 23" />
        <text class="x" x="636" y="29" text-anchor="middle">✗</text>
      </template>
      <rect class="box" :class="{ gone: r.up === 'none' }" x="680" y="8" width="70" height="30" rx="6" />

      <!-- the verdict -->
      <text class="note" :class="r.noteKind" x="772" y="19">{{ r.l1 }}</text>
      <text class="note" :class="r.noteKind" x="772" y="38">{{ r.l2 }}</text>
    </g>
  </svg>
</template>

<style scoped>
.cf { width: 100%; height: auto; display: block; overflow: visible; }
.cf text { font-family: 'Inter', system-ui, sans-serif; }
.head { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; fill: var(--text-muted); }
.group { font-size: 15px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; fill: var(--accent); }
.group-sub { font-size: 13px; fill: var(--text-muted); }
.rule { stroke: var(--line); stroke-width: 1; }
.req, .sub, .drawer-t, .tag { font-family: 'JetBrains Mono', monospace !important; }
.req { font-size: 14px; fill: var(--text); }
.sub { font-size: 12px; fill: var(--text-muted); }
.note { font-size: 13.5px; fill: var(--text); }
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
.drawer-t { font-size: 11.5px; fill: var(--text-muted); }
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
