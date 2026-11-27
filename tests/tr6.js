const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.addInitScript(() => { const D = Date; const t0 = new D('2026-11-19T09:00:00').getTime(), s = D.now(); window.Date = class extends D { constructor(...a) { if (a.length) super(...a); else super(t0 + (D.now() - s)); } static now() { return t0 + (D.now() - s); } }; });
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => planBlocks().map(b => b.id + ':' + b.min).join(' | ')));
  await p.evaluate(() => startRuth4End()); await p.waitForTimeout(800);
  console.log(await p.evaluate(() => (typeof SS !== 'undefined' && SS && SS.items ? SS.items.map(x => x.kind + ':' + (x.form || x.ref || '')).join(' ; ') : $('#v-session') ? $('#v-session').innerText.slice(0, 300) : 'none')));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
