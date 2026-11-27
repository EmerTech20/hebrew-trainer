const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => ['1:8','1:12','2:11'].map(r => { const [c,v] = r.split(':'); return r + ' ' + ruthVerse(+c,+v).he; }).join('\n')));
  await b.close(); })();
