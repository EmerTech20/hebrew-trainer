const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
(async () => { const b = await chromium.launch();
  for (const day of ['2026-11-16', '2026-11-17']) {
  const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 1100, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.addInitScript(d => { const D = Date; const t0 = new D(d + 'T14:00:00').getTime(), s = D.now(); window.Date = class extends D { constructor(...a) { if (a.length) super(...a); else super(t0 + (D.now() - s)); } static now() { return t0 + (D.now() - s); } }; }, day);
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.click('[data-tab="rescue"]'); await p.waitForTimeout(600);
  console.log(day, 'tab', await p.evaluate(() => !$('#v-rescue').hidden), await p.evaluate(() => $('#v-rescue').innerText.slice(0, 300).replace(/\s+/g, ' ')));
  if (day === '2026-11-17') {
    await p.screenshot({ path: SP + 'rt-top.png' });
    await p.click('details[data-lesson="stems"] summary'); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('details[data-lesson="stems"]').scrollIntoView()); await p.screenshot({ path: SP + 'rt-stems.png' });
    await p.click('[data-rxc="stems"]'); await p.waitForTimeout(400); console.log('cards', await p.evaluate(() => SES.title + ' ' + SES.items.length + ' back=' + SES.back));
    await p.evaluate(() => $('#s-exit').click()); await p.waitForTimeout(500); console.log('after stop tab', await p.evaluate(() => S.tab));
    await p.evaluate(() => go('rescue')); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('[data-rxd="weak|0"]').click()); await p.waitForTimeout(400); console.log('weak drill', await p.evaluate(() => SES.title + ' ' + SES.items.length + ' back=' + SES.back));
    await p.evaluate(() => go('rescue')); await p.evaluate(() => $('#rx-go').click()); await p.waitForTimeout(400); console.log('go', await p.evaluate(() => SES.title));
    await p.evaluate(() => go('today')); await p.waitForTimeout(300); console.log('today btn', await p.evaluate(() => !!document.querySelector('#plan-card [onclick*=rescue]')));
  }
  console.log(errs.join('\n') || 'NO ERRORS'); await p.context().close(); }
  await b.close(); })();
