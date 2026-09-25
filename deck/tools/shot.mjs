// Screenshots specific slides at specific click steps.
// Usage: node tools/shot.mjs <output-dir> 5:0 5:3 22:2 ...
import { chromium } from 'playwright-chromium';
const [out, ...targets] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
for (const t of targets) {
  const [slide, clicks] = t.split(':');
  await p.goto(`http://localhost:3030/${slide}?clicks=${clicks ?? 0}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}/c${slide}-${clicks ?? 0}.png` });
}
await b.close();
