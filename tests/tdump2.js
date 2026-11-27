const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const d = await p.evaluate(() => COMPQ.map((q, i) => [i, q.v.join(','), q.q, q.o[0], q.qe, q.oe ? q.oe[0] : '']).filter(x => /Ruth/.test(x[1])));
  fs.writeFileSync('/home/claude/build2/compq_ruth.json', JSON.stringify(d)); console.log(d.length); d.forEach(x => console.log(x.join(' | '))); await b.close(); })();
