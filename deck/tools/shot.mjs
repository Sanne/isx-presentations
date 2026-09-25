// Screenshots specific slides at specific click steps.
// Usage: node tools/shot.mjs <output-dir> 5:0 5:3 22:2 ...
// A real-time animation can be caught mid-play: 9:1@12000 waits 12 s.
import { chromium } from 'playwright-chromium';
const [out, ...targets] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
for (const t of targets) {
  const [target, wait] = t.split('@');
  const [slide, clicks] = target.split(':');
  await p.goto(`http://localhost:3030/${slide}?clicks=${clicks ?? 0}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(wait ? +wait : 900);
  await p.screenshot({ path: `${out}/c${slide}-${clicks ?? 0}${wait ? `@${wait}` : ''}.png` });
}
await b.close();
