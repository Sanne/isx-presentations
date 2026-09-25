import {defineConfig} from 'vite';
import motionCanvasPlugin from '@motion-canvas/vite-plugin';

// The plugin ships CJS-style; unwrap the default when loaded as ESM.
const motionCanvas = (motionCanvasPlugin as any).default ?? motionCanvasPlugin;

// Builds each Motion Canvas project to a standalone module that
// <motion-canvas-player> loads from the Slidev deck's public/ dir.
export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    motionCanvas({project: ['./cow.ts'], buildForEditor: false}),
    // The plugin predates Vite 8 and forces build.target 'modules', which
    // Rolldown rejects. Override it after the plugin's own config hook.
    {name: 'mc-target-fix', enforce: 'post', config: () => ({build: {target: 'es2022'}})},
  ],
  build: {
    outDir: '../public/mc',
    emptyOutDir: true,
    rollupOptions: {output: {entryFileNames: '[name].js'}},
  },
});
