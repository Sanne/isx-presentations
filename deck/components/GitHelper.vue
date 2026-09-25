<script setup lang="ts">
// What happens on `git fetch agent-1`: git's own remote-helper protocol,
// a bash shim, the native isx command, and Incus exec over a WebSocket into
// the machine, with the pack stream flowing through untouched.
// Slide: clicks: 2. Facts from DESIGN.md "Git Remote Helper". The two notes
// say what this buys you; the bash/Java split is in the speaker notes.
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()

const hops = [
  { title: 'git fetch agent-1', sub: 'on your laptop', code: 'isx://agent-1/~/shop' },
  { title: 'git-remote-isx', sub: 'the helper git runs for isx:// URLs', code: '' },
  { title: 'isx git-remote-helper', sub: 'checks the machine, allows only the git service', code: '' },
  { title: 'Incus exec', sub: 'stdin / stdout over a WebSocket', code: '' },
  { title: 'git-upload-pack', sub: 'inside agent-1', code: '~/shop' },
]
</script>

<template>
  <div class="gh">
    <div class="hops">
      <div v-for="h in hops" :key="h.title" class="hop">
        <b>{{ h.title }}</b>
        <span>{{ h.sub }}</span>
        <code v-if="h.code">{{ h.code }}</code>
      </div>
    </div>
    <div class="stream"><span>the git pack stream flows end to end, untouched</span></div>

    <div class="notes">
      <div class="n" :class="{ on: $clicks >= 1 }">
        <h4>Nothing to set up, nothing listening</h4>
        <p>Git rides the connection isx already has to the machine. No SSH, no port, no daemon inside it, and on macOS the same path runs through the appliance. Plain <code>git fetch</code>, <code>git diff</code>, <code>git push</code>.</p>
      </div>
      <div class="n" :class="{ on: $clicks >= 2 }">
        <h4>Remotes that manage themselves</h4>
        <p><code>isx branch</code> adds the remote to every host checkout of the same repository, matching ssh and https URLs alike. <code>isx destroy</code> removes it by scanning for <code>isx://</code> URLs, so there's no state to go stale.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gh { display: flex; flex-direction: column; gap: 14px; }
.hops { display: flex; gap: 14px; }
.hop {
  flex: 1; position: relative;
  background: var(--surface-2); border: 1px solid var(--line); border-top: 2px solid var(--accent);
  border-radius: 6px; padding: 12px 12px 14px;
  display: flex; flex-direction: column; gap: 6px;
}
.hop + .hop::before {
  content: '→'; position: absolute; left: -14px; top: 22px; transform: translateX(-50%);
  color: var(--accent); font-size: 18px;
}
.hop b { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--text); }
.hop span { font-size: 15px; line-height: 1.35; color: var(--text-muted); }
.hop code { font-size: 13px; color: var(--accent); }

.stream {
  position: relative; height: 34px; border-radius: 6px;
  background: repeating-linear-gradient(90deg, var(--accent-soft) 0 18px, transparent 18px 30px);
  background-size: 30px 100%;
  animation: flow .8s linear infinite;
  border: 1px solid var(--accent-edge);
  display: flex; align-items: center; justify-content: center;
}
.stream span { font-size: 15px; color: var(--accent); background: var(--bg); padding: 2px 10px; border-radius: 4px; }
@keyframes flow { to { background-position: 30px 0; } }

.notes { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 6px; align-items: start; }
.n { background: var(--surface); border-radius: 6px; padding: 12px 16px 14px; opacity: 0; transition: opacity .45s; }
.n.on { opacity: 1; }
.n h4 { font-size: 20px; font-weight: 600; color: var(--accent); margin: 0 0 6px; }
.n p { font-size: 16px; line-height: 1.45; color: var(--text-muted); margin: 0; }
.n code { font-size: 0.9em; }
</style>
