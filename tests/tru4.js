const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => [ruthVerse(4,5).he, ruthVerse(3,3).he, ruthVerse(2,10).he, ruthProf(4,5,ruthVerse(4,5).he), ruthProf(2,9,ruthVerse(2,9).he)].join('\n')));
  await b.close(); })();
