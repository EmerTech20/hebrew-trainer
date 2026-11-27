const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 420, height: 900 }, deviceScaleFactor: 1 })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  // PATTERNS card through the pattern deck
  await p.evaluate(() => { const it = PATTERNS[4]; startSession({ title: 't', items: [{ ...it, kind: 'mc', o: it.o, a: 0 }], back: 'today', mode: 'practice' }); }); await p.waitForTimeout(700);
  await p.click('.opt[data-o="1"]'); await p.waitForTimeout(500);
  await p.screenshot({ path: SP + 'pat1121.png', fullPage: true });
  await p.evaluate(() => go('rescue')); await p.waitForTimeout(1500);
  await p.evaluate(() => { const d = document.querySelector('details[data-lesson="ruth4"]'); if (d) { d.open = true; d.scrollIntoView(); } }); await p.waitForTimeout(500);
  const el = await p.$('details[data-lesson="ruth4"]'); if (el) await el.screenshot({ path: SP + 'ruth4.png' }); else console.log('no ruth4 lesson on page');
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
