const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const d = await p.evaluate(() => STORYQ.map((q, i) => [i, q.ch, q.ref || (q.v || []).join(','), q.q, q.o ? q.o[0] : '', q.qe, q.y]));
  fs.writeFileSync('/home/claude/build2/storyq.json', JSON.stringify(d)); console.log(d.length, Object.keys(await p.evaluate(() => STORYQ[0])));
  d.filter(x => [18, 19, 20, 22].includes(+x[1])).forEach(x => console.log(x.join(' | ').slice(0, 260))); await b.close(); })();
