import { defineConfig } from 'vite'

export default defineConfig({
  slidev: {
    vue: {
      template: {
        // <motion-canvas-player> is a web component, not a Vue component.
        compilerOptions: { isCustomElement: tag => tag.startsWith('motion-canvas-') },
      },
    },
  },
})
