// Screenshots every slide (all clicks revealed) and flags overflow or a pinned
// footnote colliding with content. Needs the dev server on :3030.
// Usage: node tools/audit.mjs <output-dir>
import { chromium } from 'playwright-chromium';
const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' && !/FloatingVue|Wake Lock/.test(m.text())) errs.push(m.text().slice(0, 200)); });
await p.goto('http://localhost:3030/1', { waitUntil: 'networkidle' });
const total = await p.evaluate(() => window.__slidev__?.nav?.total ?? null);
const n = total ?? 45;
for (let i = 1; i <= n; i++) {
  await p.goto(`http://localhost:3030/${i}?clicks=99`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const layout = [...document.querySelectorAll('.slidev-page')].find(e => e.offsetParent !== null && getComputedStyle(e).opacity !== '0')?.querySelector('.slidev-layout');
    if (!layout) return null;
    const top = layout.getBoundingClientRect().top;
    const scale = layout.getBoundingClientRect().height / layout.offsetHeight;
    let max = 0;
    // [data-overlay] marks a full-bleed overlay that is meant to cover the slide.
    layout.querySelectorAll('*').forEach(el => { if (el.closest('[data-overlay]')) return; const bb = el.getBoundingClientRect(); if (bb.height) max = Math.max(max, (bb.bottom - top) / scale); });
    const title = (layout.querySelector('h1,h2')?.textContent ?? '').trim().slice(0, 50);
    // pinned notes overlapping content above them
    let overlap = false;
    const pin = layout.querySelector('.note.pin');
    if (pin) {
      const pt = pin.getBoundingClientRect().top;
      layout.querySelectorAll(':scope > *:not(.note)').forEach(el => { if (el.getBoundingClientRect().bottom > pt - 6) overlap = true; });
    }
    return { max: Math.round(max), title, overlap };
  });
  await p.screenshot({ path: `${out}/s${String(i).padStart(2, '0')}.png` });
  const flag = !r ? 'NO LAYOUT' : (r.max > 700 ? 'OVERFLOW' : '') + (r.overlap ? ' PIN-OVERLAP' : '');
  console.log(String(i).padStart(2), String(r?.max).padStart(4), flag.padEnd(12), r?.title);
}
console.log(errs.length ? errs.join('\n') : 'no errors');
await b.close();
