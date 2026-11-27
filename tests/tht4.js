const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 760, height: 1400 }, colorScheme: 'dark' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { const v = document.querySelector('section.view:not([hidden])'); v.innerHTML = '<div class="card">' + parseAnswerHTML({ form: 'תָּשִׁבִי', root: 'שׁוב', stem: 'hiphil', conj: 'yiqtol', pgn: '2fs', gloss: 'you (f.) will bring back' }) + '</div>'; });
  await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/ht.png', fullPage: true });
  await b.close(); })();
