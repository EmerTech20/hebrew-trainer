const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => [5,6,8,11,12,14,15,17].map(v => '4:'+v+' '+JSON.stringify(ruthVerse(4,v))).join('\n')));
  console.log(await p.evaluate(() => '2:5 '+JSON.stringify(ruthVerse(2,5))));
  await b.close(); })();
