<script setup lang="ts">
// Placeholder for an animation from STORYBOARD.md that isn't built yet,
// so the draft shows where it goes without pretending it exists.
defineProps<{ kind?: 'native' | 'clip' | 'demo' }>()
</script>

<template>
  <div class="todo">
    <span class="todo-tag">{{ kind ?? 'native' }} animation · not built yet</span>
    <div class="todo-body"><slot /></div>
  </div>
</template>

<style scoped>
.todo {
  border: 2px dashed var(--line);
  border-radius: 10px;
  padding: 18px 22px;
  color: var(--text-muted);
}
.todo-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--warn);
}
.todo-body { font-size: 20px; line-height: 1.5; margin-top: 8px; }
</style>
