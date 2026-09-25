<script setup lang="ts">
// Two agents, one localhost: agent B's integration tests quietly run against
// agent A's database. One step per click (slide: clicks: 3):
//  0  A starts its database on :5432 and migrates it to its new schema
//  1  B starts its own: "port is already allocated", but its wait-for-db
//     check passes, because *something* answers on :5432
//  2  B's integration tests connect, to A's database, and pass
//  3  B's teardown truncates the tables; A's tests start failing
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()
const step = computed(() => $clicks.value)
</script>

<template>
  <svg class="ps" viewBox="0 0 1160 400" role="img"
       aria-label="Agent A runs Postgres on localhost 5432. Agent B's own database fails to start because the port is taken, but its readiness check passes, so B's tests run against A's database and pass; B's teardown then empties A's tables and A's tests fail.">
    <!-- Agent A -->
    <rect class="agent" x="10" y="20" width="360" height="250" rx="12" />
    <text class="title" x="30" y="56">Agent A</text>
    <text class="dim" x="30" y="80">worktree fix-auth</text>
    <text class="cmd" x="30" y="122">$ docker compose up db</text>
    <text class="ok" x="30" y="150">✓ postgres on :5432</text>
    <text class="ok" x="30" y="178">✓ migrated to schema v43</text>
    <g class="reveal" :class="{ on: step >= 3 }">
      <text class="bad" x="30" y="222">✗ expected 3 orders, found 0</text>
      <text class="dim" x="30" y="248">…starts debugging its own code</text>
    </g>

    <!-- the shared database -->
    <g :class="{ wiped: step >= 3 }">
      <path class="db" d="M470 70 a110 26 0 0 1 220 0 v190 a110 26 0 0 1 -220 0 z" />
      <ellipse class="db-top" cx="580" cy="70" rx="110" ry="26" />
      <text class="title mid" x="580" y="128">localhost:5432</text>
      <text class="dim mid" x="580" y="154">A's database</text>
      <text class="dim mid" x="580" y="178">schema v43</text>
      <g class="rows">
        <rect x="520" y="200" width="120" height="12" rx="3" />
        <rect x="520" y="218" width="120" height="12" rx="3" />
        <rect x="520" y="236" width="120" height="12" rx="3" />
      </g>
    </g>
    <line class="wire a" x1="370" y1="150" x2="470" y2="150" />

    <!-- Agent B -->
    <rect class="agent" x="790" y="20" width="360" height="250" rx="12" />
    <text class="title" x="810" y="56">Agent B</text>
    <text class="dim" x="810" y="80">worktree new-endpoint</text>
    <g class="reveal" :class="{ on: step >= 1 }">
      <text class="cmd" x="810" y="122">$ docker compose up db</text>
      <text class="bad" x="810" y="150">✗ port 5432 is already allocated</text>
      <text class="warn" x="810" y="178">✓ wait-for-db: :5432 is ready</text>
    </g>
    <g class="reveal" :class="{ on: step >= 2 }">
      <text class="ok" x="810" y="222">✓ integration tests: 48 passed</text>
    </g>
    <g class="reveal" :class="{ on: step >= 3 }">
      <text class="bad" x="810" y="248">teardown: TRUNCATE orders</text>
    </g>

    <!-- B's own database, which never started -->
    <g class="reveal" :class="{ on: step >= 1 }">
      <rect class="ghost" x="870" y="300" width="200" height="70" rx="10" />
      <text class="dim mid" x="970" y="330">B's database</text>
      <text class="bad mid small" x="970" y="354">never started</text>
    </g>

    <!-- B's traffic, going to the wrong place -->
    <g class="reveal" :class="{ on: step >= 2 }">
      <path class="wire b" d="M790 200 C 740 200, 730 170, 690 170" />
      <text class="lbl-b" x="740" y="228">B's tests</text>
    </g>
    <g class="reveal" :class="{ on: step >= 3 }">
      <path class="wire kill" d="M790 250 C 740 250, 730 232, 690 232" />
    </g>
  </svg>
</template>

<style scoped>
.ps { width: 100%; height: auto; display: block; }
.ps text { font-family: 'JetBrains Mono', monospace; font-size: 17px; }
.agent { fill: var(--surface); stroke: var(--line); stroke-width: 1.5; }
.title { font-family: 'Inter', sans-serif !important; font-size: 22px !important; font-weight: 600; fill: var(--text); }
.dim { fill: var(--text-muted); font-size: 15px !important; }
.cmd { fill: var(--text-muted); }
.ok { fill: var(--accent); }
.warn { fill: var(--warn); }
.bad { fill: var(--danger); }
.mid { text-anchor: middle; }
.small { font-size: 14px !important; }

.db { fill: var(--surface-2); stroke: var(--accent-edge); stroke-width: 2; transition: stroke .5s; }
.db-top { fill: var(--surface); stroke: var(--accent-edge); stroke-width: 2; transition: stroke .5s; }
.rows rect { fill: var(--accent-soft); stroke: var(--accent-edge); transition: opacity .6s; }
.wiped .db, .wiped .db-top { stroke: var(--danger); }
.wiped .rows rect { opacity: 0; }

.ghost { fill: none; stroke: var(--danger); stroke-width: 2; stroke-dasharray: 7 6; }

.wire { fill: none; stroke-width: 3; }
.wire.a { stroke: var(--accent); }
.wire.b { stroke: var(--warn); stroke-dasharray: 10 7; animation: march .7s linear infinite; }
.wire.kill { stroke: var(--danger); stroke-dasharray: 10 7; animation: march .5s linear infinite; }
@keyframes march { to { stroke-dashoffset: -17; } }
.lbl-b { fill: var(--warn); font-size: 14px !important; text-anchor: middle; }

.reveal { opacity: 0; transition: opacity .5s; }
.reveal.on { opacity: 1; }
</style>
