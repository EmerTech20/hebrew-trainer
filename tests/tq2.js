const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => ['הָפְעַל', 'הָקְטַל', 'קֻטַּל', 'מָרְאֶה'].map(w => w + ' ' + PR(w).replace(/<[^>]*>/g, '')).join(' | ')));
  await b.close(); })();
