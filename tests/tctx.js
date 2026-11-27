const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 900, height: 1100 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.evaluate(() => startSession({ title: 't', items: [wpMC('context', 0), wpMC('pgn', 4)] })); await p.waitForTimeout(1500);
  console.log(await p.evaluate(() => $('#v-session').innerText.slice(0, 600)));
  await p.screenshot({ path: '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/ctx.png' });
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
