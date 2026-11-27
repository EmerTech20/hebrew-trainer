const { chromium } = require('playwright'); const fs = require('fs');
const U21 = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8'));
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500); await p.evaluate(async a => importDocs(a.docs), U21);
  console.log(await p.evaluate(async () => { const o = []; for (const ch of [14, 15, 16, 17, 18, 22]) { const Q = await fsDef('storyqs/' + ch); Q.q.forEach(x => { if (qwCat(x[0]) == null) o.push(ch + ': ' + x[0]); }); } return o.join('\n'); }));
  await b.close(); })();
